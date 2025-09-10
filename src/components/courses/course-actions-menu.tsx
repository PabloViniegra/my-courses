"use client";

import { useTransition } from "react";
import {
  MoreVertical,
  Edit,
  Settings,
  Trash2,
  Eye,
  BarChart3,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CoursePublic, User as UserType } from "@/types";
import { publishCourse } from "@/lib/actions/publish-course";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CourseActionsMenuProps {
  course: CoursePublic;
  currentUser: UserType | null;
}

export function CourseActionsMenu({
  course,
  currentUser,
}: CourseActionsMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const canManageCourse =
    currentUser &&
    (currentUser.role === "ADMIN" || currentUser.id === course.instructor.id);

  if (!canManageCourse) {
    return null;
  }

  const handleEditCourse = () => {
    console.log("Edit course:", course.id);
  };

  const handleCourseSettings = () => {
    console.log("Course settings:", course.id);
  };

  const handleAnalytics = () => {
    console.log("Course analytics:", course.id);
  };

  const handlePreview = () => {
    console.log("Course preview:", course.id);
  };

  const handlePublishCourse = () => {
    startTransition(async () => {
      try {
        const result = await publishCourse(course.id);

        if (result.success) {
          toast.success("Course published successfully!");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to publish course");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        console.error("Publish course error:", error);
      }
    });
  };

  const handleDeleteCourse = () => {
    console.log("Delete course:", course.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only font-sans">Open course actions menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none font-sans">
              Course Actions
            </p>
            <p className="text-xs leading-none text-muted-foreground font-sans">
              Manage this course
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={handleEditCourse}>
          <Edit className="mr-2 h-4 w-4" />
          <span className="font-serif text-xs">Edit Course</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleCourseSettings}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span className="font-serif text-xs">Course Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={handleAnalytics}>
          <BarChart3 className="mr-2 h-4 w-4" />
          <span className="font-serif text-xs">Analytics</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={handlePreview}>
          <Eye className="mr-2 h-4 w-4" />
          <span className="font-serif text-xs">Preview</span>
        </DropdownMenuItem>

        {course.status === "DRAFT" && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handlePublishCourse}
            disabled={isPending}
          >
            <Upload className="mr-2 h-4 w-4" />
            <span className="font-serif text-xs">
              {isPending ? "Publishing..." : "Publish Course"}
            </span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {currentUser?.role === "ADMIN" && (
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={handleDeleteCourse}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="font-serif text-xs">Delete Course</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
