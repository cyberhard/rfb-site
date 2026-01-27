**users**
| name | type | comment | Description |
|-|-|-|-|
| id | integer | primary key | Уникальный id пользователя |
| sity | string | NOT NULL | Город участника |
| screen_name | string | NOT NULL | Отображаемое имя пользователя |
| phone_number | string | NOT NULL | Номер участника ака его логин |
| password | string | NOT NULL | хэшированный пароль участника |
| role | string  | | Участник, Вип, Вип+, Спонсор, Контролёр, Админка, Организатор |
| availability | boolean | NOT NULL | Статус прибытия true, false |
| defile | boolean | NOT NULL | Участник дефиле (true, false) |
| merch | boolean | NOT NULL | Выдан ли мерч (true, false) |

**tikets**
| name | type | comment | Description |
|-|-|-|-|
| id | integer | primary key | Уникальный id билета |
| type | string | | Участник, Вип, Вип+, Спонсор |
| price| int | | 600, 1000, 2000, 8000 |

**events**
| name | type | comment | Description |
|-|-|-|-|
| id | integer | primary key | уникальный id ивента |
| titile| string | NOT NULL | название ивента |
| time | date and time | | 30 июля дефолтное значение, задаём только время |
| status | string | NOT NULL | |
