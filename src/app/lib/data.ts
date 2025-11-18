// lib/data.ts
// Этот файл будет хранить данные, которые можно переиспользовать

export type ParticipantRole =
  | "Участник"
  | "Вип"
  | "Вип+"
  | "Спонсор"
  | "Контролёр"
  | "Организатор";

export type UserTag =
  | "Заблокирован"
  | "Ожидает подтверждения"
  | "Активирован"
  | "Аннулирован";

export type UserStatus = "Прибыл" | "Не прибыл";

export type Participant = {
  id: number;           // id пользователя
  name: string;         // first_name + last_name из БД
  avatar: string;       // photo_url
  role: ParticipantRole;// role
  tag: UserTag;         // tags
  status: UserStatus;   // status
};

export const participants: Participant[] = [
  // ОРГАНИЗАТОРЫ
  {
    id: 1,
    name: "Анна Коваль",
    avatar: "/assets/avatars/aiko.jpg",
    role: "Организатор",
    tag: "Активирован",
    status: "Прибыл",
  },
  {
    id: 2,
    name: "Игорь Мураками",
    avatar: "/assets/avatars/kodi.jpg",
    role: "Организатор",
    tag: "Ожидает подтверждения",
    status: "Не прибыл",
  },
  {
    id: 3,
    name: "Соня Ли",
    avatar: "/assets/avatars/rei.jpg",
    role: "Организатор",
    tag: "Заблокирован",
    status: "Не прибыл",
  },
  {
    id: 4,
    name: "Макс Рейн",
    avatar: "/assets/avatars/aiko.jpg",
    role: "Организатор",
    tag: "Аннулирован",
    status: "Не прибыл",
  },

  // КОНТРОЛЁРЫ
  {
    id: 5,
    name: "Джин Хан",
    avatar: "/assets/avatars/kodi.jpg",
    role: "Контролёр",
    tag: "Активирован",
    status: "Прибыл",
  },
  {
    id: 6,
    name: "Лера Сано",
    avatar: "/assets/avatars/rei.jpg",
    role: "Контролёр",
    tag: "Ожидает подтверждения",
    status: "Не прибыл",
  },
  {
    id: 7,
    name: "Тору Мия",
    avatar: "/assets/avatars/aiko.jpg",
    role: "Контролёр",
    tag: "Заблокирован",
    status: "Не прибыл",
  },
  {
    id: 8,
    name: "Ника Блэк",
    avatar: "/assets/avatars/kodi.jpg",
    role: "Контролёр",
    tag: "Аннулирован",
    status: "Не прибыл",
  },

  // СПОНСОРЫ
  {
    id: 9,
    name: "Рей Куросава",
    avatar: "/assets/avatars/rei.jpg",
    role: "Спонсор",
    tag: "Активирован",
    status: "Прибыл",
  },
  {
    id: 10,
    name: "Марко Тэн",
    avatar: "/assets/avatars/aiko.jpg",
    role: "Спонсор",
    tag: "Ожидает подтверждения",
    status: "Не прибыл",
  },
  {
    id: 11,
    name: "Ая Хошино",
    avatar: "/assets/avatars/kodi.jpg",
    role: "Спонсор",
    tag: "Заблокирован",
    status: "Не прибыл",
  },
  {
    id: 12,
    name: "Том Сато",
    avatar: "/assets/avatars/rei.jpg",
    role: "Спонсор",
    tag: "Аннулирован",
    status: "Не прибыл",
  },

  // ВИП+
  {
    id: 13,
    name: "Мика Хошино",
    avatar: "/assets/avatars/aiko.jpg",
    role: "Вип+",
    tag: "Активирован",
    status: "Прибыл",
  },
  {
    id: 14,
    name: "Лео Сигма",
    avatar: "/assets/avatars/kodi.jpg",
    role: "Вип+",
    tag: "Ожидает подтверждения",
    status: "Не прибыл",
  },
  {
    id: 15,
    name: "Сора Ким",
    avatar: "/assets/avatars/rei.jpg",
    role: "Вип+",
    tag: "Заблокирован",
    status: "Не прибыл",
  },
  {
    id: 16,
    name: "Инна Дэй",
    avatar: "/assets/avatars/aiko.jpg",
    role: "Вип+",
    tag: "Аннулирован",
    status: "Не прибыл",
  },

  // ВИП
  {
    id: 17,
    name: "Айко Тэн",
    avatar: "/assets/avatars/kodi.jpg",
    role: "Вип",
    tag: "Активирован",
    status: "Прибыл",
  },
  {
    id: 18,
    name: "Коди Хэллфин",
    avatar: "/assets/avatars/rei.jpg",
    role: "Вип",
    tag: "Ожидает подтверждения",
    status: "Не прибыл",
  },
  {
    id: 19,
    name: "Ру Накамура",
    avatar: "/assets/avatars/aiko.jpg",
    role: "Вип",
    tag: "Заблокирован",
    status: "Не прибыл",
  },
  {
    id: 20,
    name: "Соня Кац",
    avatar: "/assets/avatars/kodi.jpg",
    role: "Вип",
    tag: "Аннулирован",
    status: "Не прибыл",
  },

  // УЧАСТНИКИ
  {
    id: 21,
    name: "Коди Хэллфин",
    avatar: "/assets/avatars/rei.jpg",
    role: "Участник",
    tag: "Активирован",
    status: "Прибыл",
  },
  {
    id: 22,
    name: "Айко Тэн",
    avatar: "/assets/avatars/aiko.jpg",
    role: "Участник",
    tag: "Ожидает подтверждения",
    status: "Не прибыл",
  },
  {
    id: 23,
    name: "Рей Куросава",
    avatar: "/assets/avatars/kodi.jpg",
    role: "Участник",
    tag: "Заблокирован",
    status: "Не прибыл",
  },
  {
    id: 24,
    name: "Лина Фокс",
    avatar: "/assets/avatars/rei.jpg",
    role: "Участник",
    tag: "Аннулирован",
    status: "Не прибыл",
  },
];
