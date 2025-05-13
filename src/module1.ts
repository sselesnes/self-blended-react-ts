// Прості типи
// У TypeScript, як і в JavaScript, є набір простих типів, які називають скалярними.
const isOnline: boolean = false;
const weight: number = 3.14;
const username: string = "Jacob";

// Даних про користувача ще немає
let user1: null = null;

// Налаштування ще не ініціалізовані
let config1: undefined;

// Типізація об'єктів
const user2: { name: string; age: number } = {
  name: "Alice",
  age: 25,
};

// Літеральні типи
type Sex = "male" | "female" | "alien";

// Оголошуємо інтерфейс користувача
interface User {
  readonly id: number;
  name: string;
  surname?: string;
  age: number;
  sex?: Sex;
}

const jacob: User = {
  id: 1,
  name: "Jacob",
  age: 36,
  sex: "alien",
};

console.log(jacob.surname); // undefined
jacob.id = 11;

const numbers1: number[] = [1, 2, 3, 4, 5];
const names1: string[] = ["Alice", "Bob", "Charlie"];

const numbers2: Array<number> = [1, 2, 3, 4, 5];
const names2: Array<string> = ["Alice", "Bob", "Charlie"];

const users1: User[] = [
  { id: 2, name: "Alice", age: 25 },
  { id: 3, name: "Jacob", age: 30, surname: "Doe", sex: "male" },
];
const usersSelected = users1.find(user => user.age === 30);
console.log(usersSelected);

//
function getLastItem<T>(arr: T[]): T {
  // function getLastItem<string>(arr: string[]): string {
  return arr[arr.length - 1];
  // повертає string
}
const lastColor = getLastItem(["red", "green", "blue"]);
// const lastColor = getLastItem<string>(["red", "green", "blue"]);

// Власні типи -  Union Type (|) та Intersection Type (&)
let currentTheme: "light" | "dark" | null = null;

//
interface Tags {
  tags: string[];
}

type NewUser = User & Tags;
const user4: NewUser = {
  id: 4,
  name: "John",
  age: 27,
  tags: ["developer", "typescript", "frontend"],
};

user4.tags.push("fullstack");

// Використовуйте interface, якщо описуєте структуру об'єкта.
// Використовуйте type, якщо створюєте об'єднання типів (Union), перетини (Intersection), літеральні значення або складні структури даних.

// Типізація функцій
function sum(a: number, b: number): number {
  return a + b + " result";
}
console.log(sum(5, 4));

//
const getUserNames = (users: User[]): string[] => {
  return users.map(user => user.name);
};
const names3 = getUserNames(users1);
console.log(names3);

// Function Type (Тип функції)
type AddFunction = (a: number, b: number) => number;
const add2: AddFunction = (x, y) => x + y;
console.log(add2(2, 3)); // 5

// Перелічення (enum)
// Enum – це список іменованих констант, які можна використовувати як змінні - тип тількі string або number
// Union Type – це просто список допустимих значень, які можна присвоювати змінним.
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST",
}

let userRole: Role = Role.Admin;
console.log(userRole); // "ADMIN"

// Мета використання Generic (Узагальнені типи) та типізації в TypeScript загалом — виявити помилки на етапі компіляції, до того, як код запуститься, і уникнути помилок під час виконання (runtime errors).
// <T> - походить від Type, Якщо потрібно більше одного узагальненого типу, зазвичай використовують наступні літери алфавіту або інші осмислені імена:
// <T, U> — для двох типів (наприклад, T і U можуть означати "Type" і "Another Type").
// <K, V> — для ключів і значень (походить від "Key" і "Value"), часто використовується в словниках або мапах.
// <T1, T2, T3> — якщо багато типів, але це вже менш читабельно.

function identity<T>(value: T): T {
  console.log(typeof value);
  return value;
}

console.log(identity(42)); // неявно вказаний тип T - TypeScript використовує type inference (виведення типу) для визначення T на основі переданого аргументу value.
console.log(identity<string>(42));
console.log(identity<string>("Hello")); // явно вказаний тип T
console.log(identity(true));

// generic в інтерфейсах і об'єктах
interface List<T> {
  items: T[];
  getItem: (index: number) => T;
}

const numberList: List<number> = {
  items: [1, 2, 3],
  getItem(index) {
    return this.items[index];
  },
};

const stringList: List<string> = {
  items: ["Alice", "Bob"],
  getItem(index) {
    return this.items[index];
  },
};
numberList.getItem(3); // 3
stringList.getItem(2); // "Alice"

//
interface ApiResponse<T> {
  data: T;
  status: number;
}

const userResponse: ApiResponse<{ id: number; name: string }> = {
  data: {
    id: 1,
    name: "Alice",
  },
  status: 200,
};

const invoiceResponse: ApiResponse<{ email: string; amount: number }> = {
  data: {
    email: "alice@mail.com",
    amount: 150,
  },
  status: 201,
};

// Типізація промісів
interface User2 {
  id: number;
  name: string;
}

const getUser = (): Promise<User2> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id: 1, name: "Alice" }), 1000);
  });
};

getUser().then(user => console.log(user.name)); // "Alice"

//
interface Product {
  id: number;
  title: string;
}

const getProducts = (): Promise<Product[]> => {
  return new Promise(resolve => {
    resolve([{ id: 1, title: "Phone" }]);
  });
};

getProducts().then(products => {
  console.log(products); // [{ id: 1, title: "Phone" }]
});

// Типізація fetch
interface User3 {
  id: number;
  name: string;
  email: string;
}

const fetchUser = async (userId: number): Promise<User3> => {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  const data = (await response.json()) as User3;
  return data;
};

const fetchUsers = async (): Promise<User3[]> => {
  const response = await fetch("https://api.example.com/users");
  const data = (await response.json()) as User3[];
  return data;
};

//
import axios from "axios";

const fetchUserA = async (userId: number): Promise<User3> => {
  const response = await axios.get<User3>(`https://api.example.com/users/${userId}`);
  return response.data;
};

const fetchUsersA = async (): Promise<User3[]> => {
  const response = await axios.get<User3[]>("https://api.example.com/users");
  return response.data;
};

//
