**users**
| name | type | comment | Description |
|-|-|-|-|
| id | integer | primary key | Уникальный id пользователя |
| vk_id | string | | VK ID |
| first_name | string | | Имя пользователя |
| last_name | string | | Фамилия пользователя |
| screen_name | string | | Отображаемое имя пользователя |
| photo_url | string | | URL ссылка на аватарку |
| role | string | | Участник, Вип, Вип+, Спонсор, Контролёр, Админка, Организатор | 
| tags | string | | Заблокирован(Ban Hummer), Ожидает подтверждения, Активирован (куплен билет), Аннулирован |

**tikets**
| name | type | comment | Description |
|-|-|-|-|
| id | integer | primary key | Уникальный id билета |
| vk_id | int | - | id Пользователя|

**tags**
|-|-|-|-|
| vk_id | int | primary key | id Пользователя|
| availability | boolean | not null | Статус прибытя true, false|
| defile | boolean | not null | Участник дефиле (true, false)|
| merch | boolean | not null | Выдан ли мерч (true, false)|