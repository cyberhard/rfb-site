"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  Chip,
  Accordion,
  AccordionItem,
  User,
  Avatar,
} from "@heroui/react";
import {
  participants,
  Participant,
  ParticipantRole,
} from "../lib/data";

const roles: { key: ParticipantRole; label: string }[] = [
  { key: "Организатор", label: "Организатор" },
  { key: "Контролёр", label: "Контролёр" },
  { key: "Спонсор", label: "Спонсор" },
  { key: "Вип+", label: "Вип+" },
  { key: "Вип", label: "Вип" },
  { key: "Участник", label: "Участник" },
];

export default function ParticipantsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
        {/* Верхняя панель */}
        <header className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Назад</span>
          </Link>
          <h1 className="ml-auto text-lg font-semibold">
            Участники по ролям
          </h1>
        </header>

        {/* Ниспадающие списки по ролям (Орг → Участник) */}
        <section className="w-full">
          <Accordion
            selectionMode="multiple"
            variant="splitted"
            className="w-full"
          >
            {roles.map((role) => {
              const usersInRole = participants.filter(
                (p: Participant) => p.role === role.key,
              );

              if (!usersInRole.length) return null;

              return (
                <AccordionItem
                  key={role.key}
                  aria-label={role.label}
                  title={`${role.label} (${usersInRole.length})`}
                >
                  <div className="flex flex-col gap-2">
                    {usersInRole.map((p) => (
                    <Card
                      key={p.id}
                      shadow="sm"
                      className="flex w-full flex-row items-center justify-between gap-4 border border-zinc-800 bg-zinc-900/80 px-4 py-3"
                    >
                      {/* Слева: аватарка + владелец (как раньше) */}
                      <div className="flex min-w-0 flex-row items-center gap-4">
                        <Avatar
                          src={p.avatar}
                          alt={p.name}
                          radius="full"
                          className="h-10 w-10"
                        />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium text-zinc-100">
                            {p.name}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {p.status}
                          </span>
                        </div>
                      </div>

                      {/* Справа: только статусы, без второй аватарки */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip
                          size="sm"
                          color={p.status === "Прибыл" ? "success" : "warning"}
                          variant="flat"
                          className="text-xs"
                        >
                          {p.status}
                        </Chip>

                        <Chip
                          size="sm"
                          color={
                            p.tag === "Активирован"
                              ? "success"
                              : p.tag === "Ожидает подтверждения"
                              ? "warning"
                              : "danger"
                          }
                          variant="flat"
                          className="text-xs"
                        >
                          {p.tag}
                        </Chip>
                      </div>
                    </Card>

                    ))}
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>
      </div>
    </main>
  );
}
