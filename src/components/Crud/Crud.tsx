import css from "./Crud.module.css";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Тип для todo
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Тип для даних, що відправляються
interface NewTodo {
  title: string;
  completed: boolean;
}

// API функції
const postTodo = async (newTodo: NewTodo): Promise<Todo> =>
  (await axios.post<Todo>("https://jsonplaceholder.typicode.com/todos", newTodo)).data;

const patchTodo = async (updatedTodo: Partial<Todo> & { id: number }): Promise<Todo> =>
  (
    await axios.patch<Todo>(
      `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`,
      updatedTodo
    )
  ).data;

const deleteTodo = async (id: number): Promise<void> =>
  (await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)).data;

const fetchTodo = async (todoId: number): Promise<Todo> =>
  (await axios.get<Todo>(`https://jsonplaceholder.typicode.com/todos/${todoId}`)).data;

export default function Crud() {
  const queryClient = useQueryClient();
  const currentDateTime = new Date().toLocaleString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const newTodo: NewTodo = {
    title: `C stands for Create - ${currentDateTime}`,
    completed: false,
  };

  const createMutation = useMutation({
    mutationFn: postTodo,
    onSuccess: (data: Todo) => {
      const todoWithDate: Todo = { ...data, createdAt: currentDateTime };
      queryClient.setQueryData(["todo", data.id], todoWithDate);
      queryClient.invalidateQueries({ queryKey: ["todo", data.id] });
    },
    onError: (error: Error) => {
      console.error("Помилка при створенні Todo:", error.message);
    },
  });

  const patchMutation = useMutation({
    mutationFn: patchTodo,
    onSuccess: (data: Todo) => {
      const todoWithDate: Todo = { ...data, updatedAt: currentDateTime };
      queryClient.setQueryData(["todo", data.id], todoWithDate);
      queryClient.invalidateQueries({ queryKey: ["todo", data.id] });
    },
    onError: (error: Error) => {
      console.error("Помилка при оновленні Todo:", error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      const todoId = createMutation.data?.id;
      queryClient.setQueryData(["todo", todoId], null);
      queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
    },
    onError: (error: Error) => {
      console.error("Помилка при видаленні Todo:", error.message);
    },
  });

  const {
    data: todo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todo", createMutation.data?.id],
    queryFn: () => fetchTodo(createMutation.data!.id),
    enabled: !!createMutation.data?.id && createMutation.isSuccess,
  });

  const handleUpdate = () =>
    todo && patchMutation.mutate({ id: todo.id, title: `Updated - ${currentDateTime}` });

  const handleDelete = () => todo && deleteMutation.mutate(todo.id);

  return (
    <div className={css.container}>
      <button
        onClick={() => createMutation.mutate(newTodo)}
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? "Створюємо..." : "Створити"}
      </button>
      <button onClick={handleUpdate} disabled={!todo || patchMutation.isPending}>
        {patchMutation.isPending ? "Оновлюємо..." : "Оновити"}
      </button>
      <button onClick={handleDelete} disabled={!todo || deleteMutation.isPending}>
        {deleteMutation.isPending ? "Видаляємо..." : "Видалити"}
      </button>

      {createMutation.isError && <p>Помилка: {createMutation.error.message}</p>}
      {createMutation.isSuccess && <p>Створено! ID: {createMutation.data?.id}</p>}
      {patchMutation.isError && <p>Помилка: {patchMutation.error.message}</p>}
      {patchMutation.isSuccess && <p>Оновлено! ID: {patchMutation.data?.id}</p>}
      {deleteMutation.isError && <p>Помилка: {deleteMutation.error.message}</p>}
      {deleteMutation.isSuccess && <p>Видалено!</p>}

      {isLoading && <p>Завантаження...</p>}
      {error && <p>Помилка: {error.message}</p>}
      {!createMutation.isSuccess && !isLoading && <p>Натисніть "Створити", щоб почати</p>}
      {todo && !isLoading && !error && (
        <div>
          <p>
            <strong>ID:</strong> {todo.id}
          </p>
          <p>
            <strong>Заголовок:</strong> {todo.title}
          </p>
          <p>
            <strong>Виконано:</strong> {todo.completed ? "Так" : "Ні"}
          </p>
          {todo.createdAt && (
            <p>
              <strong>Створено:</strong> {todo.createdAt}
            </p>
          )}
          {todo.updatedAt && (
            <p>
              <strong>Оновлено:</strong> {todo.updatedAt}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
