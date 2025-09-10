"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { ChevronDown, LogOut, Settings, User as UserIcon, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { AddProfessorModal } from "@/components/modals/add-professor-modal";

interface PerfilOverviewProps {
  user: User | null;
}

export function PerfilOverview({ user }: PerfilOverviewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showAddProfessorModal, setShowAddProfessorModal] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error("Error signing out");
        return;
      }

      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred while signing out");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleCreateCourse = () => {
    router.push("/private/create-course");
  };

  const handleAddProfessor = () => {
    setShowAddProfessorModal(true);
  };

  const handleProfessorSuccess = () => {
    toast.success("Profesor añadido exitosamente");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserRoleDisplay = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "TEACHER":
        return "Profesor";
      case "STUDENT":
        return "Estudiante";
      default:
        return role;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-auto px-3 py-2 hover:bg-muted/50"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.avatar || undefined}
                alt={user.name || "User avatar"}
                className="object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  console.log("Avatar image failed to load:", user.avatar);
                  console.log("Error details:", e);
                }}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium font-sans">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-sm font-medium font-sans">
                {user.name || "Usuario"}
              </span>
              <span className="text-xs text-muted-foreground font-serif">
                {getUserRoleDisplay(user.role)}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-3">
            <p className="text-sm font-medium leading-none font-sans">
              {user.name || "Usuario"}
            </p>
            <p className="text-xs leading-none text-muted-foreground font-serif underline">
              {user.email}
            </p>
            <Badge variant="secondary" className="text-xs font-sans">
              {getUserRoleDisplay(user.role)}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          <span className="font-serif text-xs">Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span className="font-serif text-xs">Settings</span>
        </DropdownMenuItem>
        {(user.role === "ADMIN" || user.role === "TEACHER") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCreateCourse} className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              <span className="font-serif text-xs">Create Course</span>
            </DropdownMenuItem>
          </>
        )}
        {user.role === "ADMIN" && (
          <DropdownMenuItem onClick={handleAddProfessor} className="cursor-pointer">
            <UserPlus className="mr-2 h-4 w-4" />
            <span className="font-serif text-xs">Add Professor</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-serif text-xs">
            {isLoading ? "Signing out..." : "Log out"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Add Professor Modal */}
      <AddProfessorModal
        open={showAddProfessorModal}
        onOpenChange={setShowAddProfessorModal}
        onSuccess={handleProfessorSuccess}
      />
    </>
  );
}
