"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
} from "@heroui/react";
import AppNavbar from "@/components/AppNavbar";
import Image from "next/image";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    phone_number: "",
    phoneDisplay: "",
    password: "",
    screen_name: "",
    sity: "",
    role: "Участник",
    description: "",
    avatar_url: "",
    defile: false,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Обновленный список ролей с новыми
  const roles = [
    "Участник",
    "Вип",
    "Вип+",
    "Спонсор",
    "Волонтер",
    "Пресса",
    "Охрана",
    "Контролёр",
    "Админка",
    "Организатор",
  ];

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      router.replace("/login");
      return;
    }

    if (
      user &&
      user.role !== "Админка" &&
      user.role !== "Организатор" &&
      user.role !== "Контролёр"
    ) {
      router.replace("/");
      return;
    }
  }, [user, isAuthenticated, loading, router]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digits = input.replace(/\D/g, "");
    const limited = digits.slice(0, 10);
    
    // Форматируем: XXX XXX-XX-XX
    let formatted = "";
    if (limited.length > 0) {
      formatted = limited.slice(0, 3);
    }
    if (limited.length > 3) {
      formatted += " " + limited.slice(3, 6);
    }
    if (limited.length > 6) {
      formatted += "-" + limited.slice(6, 8);
    }
    if (limited.length > 8) {
      formatted += "-" + limited.slice(8, 10);
    }
    
    setFormData({
      ...formData,
      phoneDisplay: formatted,
      phone_number: limited.length > 0 ? `+7${limited}` : "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Разрешены только изображения (JPG, PNG, WEBP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Размер файла не должен превышать 5MB");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null;
    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("avatar", avatarFile);

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        return data.avatarUrl;
      } else {
        const error = await res.json();
        setError(`Ошибка загрузки аватара: ${error.message}`);
        return null;
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      setError("Не удалось загрузить аватар");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Валидация телефона
    if (!formData.phone_number.startsWith("+7") || formData.phone_number.length !== 12) {
      setError("Введите корректный номер телефона (10 цифр)");
      return;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsSubmitting(true);

    try {
      // Загружаем аватар если он есть
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
        if (avatarUrl === null && avatarFile) {
          setIsSubmitting(false);
          return;
        }
      }

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: formData.phone_number,
          password: formData.password,
          screen_name: formData.screen_name,
          sity: formData.sity,
          role: formData.role,
          description:
            formData.role === "Организатор" || formData.role === "Спонсор"
              ? formData.description
              : null,
          avatar_url: avatarUrl,
          defile: formData.defile,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Пользователь успешно добавлен!");
        setFormData({
          phone_number: "",
          phoneDisplay: "",
          password: "",
          screen_name: "",
          sity: "",
          role: "Участник",
          description: "",
          avatar_url: "",
          defile: false,
        });
        setAvatarFile(null);
        setAvatarPreview("");
      } else {
        setError(data.message || "Ошибка при создании пользователя");
      }
    } catch (err) {
      console.error("Create user error:", err);
      setError("Ошибка подключения к серверу");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f111b]">
        <div className="text-cyan-400">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (
    user.role !== "Админка" &&
    user.role !== "Организатор" &&
    user.role !== "Контролёр"
  ) {
    return null;
  }

  const isOrganizerOrSponsor =
    formData.role === "Организатор" || formData.role === "Спонсор";

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-[#0f111b] text-white p-4">
        <div className="max-w-2xl mx-auto pt-24">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Админ-панель
          </h1>
          <p className="text-gray-400 mb-8">Добавление нового участника</p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-900/50 p-6 rounded-xl border border-gray-800"
          >
            {/* Номер телефона с маской */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Номер телефона
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                  +7
                </span>
                <Input
                  type="text"
                  value={formData.phoneDisplay}
                  onChange={handlePhoneChange}
                  placeholder="999 123-45-67"
                  required
                  classNames={{
                    input: "pl-10 text-white",
                    inputWrapper:
                      "bg-gray-800 border-gray-700 hover:border-cyan-400 focus-within:border-cyan-400",
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Отображаемое имя
              </label>
              <Input
                type="text"
                name="screen_name"
                value={formData.screen_name}
                onChange={handleChange}
                placeholder="Имя участника"
                required
                classNames={{
                  input: "text-white",
                  inputWrapper:
                    "bg-gray-800 border-gray-700 hover:border-cyan-400",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Город</label>
              <Input
                type="text"
                name="sity"
                value={formData.sity}
                onChange={handleChange}
                placeholder="Город участника"
                required
                classNames={{
                  input: "text-white",
                  inputWrapper:
                    "bg-gray-800 border-gray-700 hover:border-cyan-400",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Роль</label>
              <Select
                selectedKeys={[formData.role]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  handleRoleChange(selected);
                }}
                className="w-full"
                classNames={{
                  trigger:
                    "bg-gray-800 border-gray-700 text-white data-[hover=true]:bg-gray-700",
                  popoverContent: "bg-gray-800 border-gray-700",
                  listbox: "bg-gray-800",
                  listboxWrapper: "bg-gray-800",
                }}
                popoverProps={{
                  classNames: {
                    content: "bg-gray-800 border-gray-700",
                  },
                }}
              >
                {roles.map((role) => (
                  <SelectItem key={role}>
                    {role}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Чекбокс для участия в дефиле */}
            <Checkbox
              isSelected={formData.defile}
              onValueChange={(checked) =>
                setFormData({ ...formData, defile: checked })
              }
              classNames={{
                wrapper: "before:border-gray-700",
              }}
            >
              <span className="text-white">Участник дефиле</span>
            </Checkbox>

            {/* Аватарка для всех ролей */}
            <div>
              <label className="block text-sm font-medium mb-2">
                📸 Аватарка (опционально)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-cyan-500 file:text-black
                  hover:file:bg-cyan-400
                  file:cursor-pointer cursor-pointer"
              />
              {avatarPreview && (
                <div className="mt-4">
                  <Image
                    src={avatarPreview}
                    alt="Preview"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <p className="text-gray-500 text-sm mt-2">
                JPG, PNG или WEBP, макс. 5MB
              </p>
            </div>

            {/* Описание для организаторов и спонсоров */}
            {isOrganizerOrSponsor && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  📝 Описание (опционально)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Краткое описание организатора/спонсора..."
                  minRows={3}
                  maxRows={6}
                  classNames={{
                    base: "w-full",
                    input: "text-white resize-none",
                    inputWrapper:
                      "bg-gray-800 border-gray-700 hover:border-gray-600",
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Минимум 6 символов"
                required
                classNames={{
                  input: "text-white",
                  inputWrapper:
                    "bg-gray-800 border-gray-700 hover:border-cyan-400",
                }}
              />
            </div>

            {success && (
              <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold px-5 py-2 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              {isUploading
                ? "Загрузка аватара..."
                : isSubmitting
                ? "Добавление..."
                : "Добавить участника"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
