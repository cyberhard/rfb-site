"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import Image from "next/image";

type ParticipantRole =
  | "Участник"
  | "Вип"
  | "Вип+"
  | "Спонсор"
  | "Организатор"
  | "Волонтер"
  | "Пресса"
  | "Охрана"
  | "Контролёр"
  | "Админка";

type User = {
  id: number;
  phone_number: string;
  screen_name: string;
  sity: string;
  role: string;
  availability: boolean;
  defile: boolean;
  merch: boolean;
  avatar_url?: string;
  description?: string;
};

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isAdmin: boolean;
  onSuccess: (updatedUser: Partial<User>) => void;
  onDelete?: (userId: number) => void; // ✅ ИСПРАВЛЕНО
}

const roles: { key: ParticipantRole; label: string }[] = [
  { key: "Организатор", label: "Организатор" },
  { key: "Спонсор", label: "Спонсор" },
  { key: "Вип+", label: "Вип+" },
  { key: "Вип", label: "Вип" },
  { key: "Участник", label: "Участник" },
  { key: "Волонтер", label: "Волонтер" },
  { key: "Пресса", label: "Пресса" },
  { key: "Охрана", label: "Охрана" },
  { key: "Контролёр", label: "Контролёр" },
  { key: "Админка", label: "Админка" },
];

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  isAdmin,
  onSuccess,
  onDelete,
}: EditProfileModalProps) {
  const [editForm, setEditForm] = useState({
    screen_name: "",
    sity: "",
    role: "",
    description: "",
    password: "",
    avatar_url: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user && isOpen) {
      setEditForm({
        screen_name: user.screen_name || "",
        sity: user.sity || "",
        role: user.role || "",
        description: user.description || "",
        password: "",
        avatar_url: user.avatar_url || "",
      });
      setAvatarPreview(user.avatar_url || "");
      setAvatarFile(null);
      setError("");
      setSuccess("");
    }
  }, [user, isOpen]);

  const isOrganizerOrSponsor =
    editForm.role === "Организатор" || editForm.role === "Спонсор";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Допустимые форматы: JPG, PNG, WEBP");
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
        setError(error.message || "Не удалось загрузить аватар");
        return null;
      }
    } catch (error) {
      console.error("Upload avatar error:", error);
      setError("Ошибка при загрузке аватара");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(
      `Вы уверены, что хотите удалить профиль "${user.screen_name || user.phone_number}"? Это действие необратимо!`
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMessage = "Не удалось удалить профиль";

        if (contentType?.includes("application/json")) {
          const data = await res.json();
          errorMessage = data.message || errorMessage;
        } else {
          errorMessage = `Ошибка ${res.status}: Сервер вернул некорректный ответ`;
        }

        throw new Error(errorMessage);
      }

      setSuccess("Профиль успешно удален!");

      if (onDelete) {
        onDelete(user.id);
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Ошибка при удалении"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      let avatarUrl = editForm.avatar_url;
      if (avatarFile) {
        const uploaded = await uploadAvatar();
        if (uploaded) {
          avatarUrl = uploaded;
        } else {
          setIsSaving(false);
          return;
        }
      }

      const updateData: any = {
        screen_name: editForm.screen_name,
        sity: editForm.sity,
        avatar_url: avatarUrl,
      };

      if (isAdmin) {
        updateData.role = editForm.role;
        if (editForm.role === "Организатор" || editForm.role === "Спонсор") {
          updateData.description = editForm.description;
        }
      } else {
        if (user.role === "Организатор" || user.role === "Спонсор") {
          updateData.description = editForm.description;
        }
      }

      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
        credentials: "include",
      });

      if (!res.ok) {
        // ✅ ИСПРАВЛЕНО: добавлена проверка content-type
        const contentType = res.headers.get("content-type");
        let errorMessage = "Не удалось обновить профиль";

        if (contentType?.includes("application/json")) {
          const data = await res.json();
          errorMessage = data.message || errorMessage;
        } else {
          errorMessage = `Ошибка ${res.status}: Сервер вернул некорректный ответ`;
        }

        throw new Error(errorMessage);
      }

      if (editForm.password) {
        if (editForm.password.length < 6) {
          throw new Error("Пароль должен содержать минимум 6 символов");
        }

        const passRes = await fetch("/api/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            newPassword: editForm.password,
          }),
          credentials: "include",
        });

        if (!passRes.ok) {
          const data = await passRes.json();
          throw new Error(data.message || "Не удалось изменить пароль");
        }
      }

      const updatedData = await res.json();
      setSuccess("Профиль успешно обновлен!");

      onSuccess(updatedData.user);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Ошибка при сохранении"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-gray-900 text-white",
        header: "border-b border-gray-800",
        body: "py-6",
        footer: "border-t border-gray-800",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold text-cyan-400">
            Редактирование профиля
          </h2>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {isOrganizerOrSponsor && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-cyan-400">
                  Аватар
                </label>
                {avatarPreview && (
                  <div className="flex justify-center mb-3">
                    <Image
                      src={avatarPreview}
                      alt="Аватар"
                      width={120}
                      height={120}
                      className="rounded-full object-cover border-2 border-cyan-400"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 file:cursor-pointer cursor-pointer"
                />
                <p className="text-xs text-gray-400">
                  Форматы: JPG, PNG или WEBP. Максимум 5MB
                </p>
              </div>
            )}

            {/* ✅ ИСПРАВЛЕНО: использован label prop */}
            <label className="block text-sm font-medium text-gray-300">
              Имя
            </label>
            <Input
              labelPlacement="outside"
              placeholder="Введите имя"
              value={editForm.screen_name}
              onChange={(e) =>
                setEditForm({ ...editForm, screen_name: e.target.value })
              }
              classNames={{
                label: "text-gray-300 font-medium mb-1",
                input: "text-white",
                inputWrapper: "bg-gray-800 border-gray-700",
              }}
            />
            <label className="block text-sm font-medium text-gray-300">
              Город
            </label>
            <Input
              labelPlacement="outside"
              placeholder="Введите город"
              value={editForm.sity}
              onChange={(e) =>
                setEditForm({ ...editForm, sity: e.target.value })
              }
              classNames={{
                label: "text-gray-300 font-medium mb-1",
                input: "text-white",
                inputWrapper: "bg-gray-800 border-gray-700",
              }}
            />

            {isAdmin && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">
                  Роль
                </label>
                <Select
                  selectedKeys={[editForm.role]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setEditForm({ ...editForm, role: selected });
                  }}
                  classNames={{
                    trigger: "bg-gray-800 border-gray-700 text-white",
                    popoverContent: "bg-gray-800 border-gray-700",
                  }}
                >
                  {roles.map((role) => (
                    <SelectItem key={role.key}>{role.label}</SelectItem>
                  ))}
                </Select>
              </div>
            )}

            {isOrganizerOrSponsor && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">
                  Описание
                </label>
                <Textarea
                  placeholder="Расскажите о себе..."
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  minRows={3}
                  maxRows={6}
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-gray-800 border-gray-700",
                  }}
                />
              </div>
            )}
            <label className="block text-sm font-medium text-gray-300">
              Новый пароль
            </label>
            <Input
              labelPlacement="outside"
              placeholder="Оставьте пустым, если не хотите менять"
              type="password"
              value={editForm.password}
              onChange={(e) =>
                setEditForm({ ...editForm, password: e.target.value })
              }
              classNames={{
                label: "text-gray-300 font-medium mb-1",
                input: "text-white",
                inputWrapper: "bg-gray-800 border-gray-700",
              }}
            />

            {success && (
              <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </ModalBody>

        {/* ✅ ИСПРАВЛЕНО: кнопка удаления внутри ModalFooter */}
        <ModalFooter className="flex justify-between">
          <div>
            {isAdmin && (
              <Button
                color="danger"
                variant="flat"
                onPress={handleDelete}
                isLoading={isDeleting}
                isDisabled={isSaving}
              >
                Удалить профиль
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              color="danger" 
              variant="light" 
              onPress={onClose}
              isDisabled={isSaving || isDeleting}
            >
              Отмена
            </Button>
            <Button
              color="primary"
              onPress={handleSave}
              isLoading={isSaving || isUploading}
              isDisabled={isDeleting}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              Сохранить
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
