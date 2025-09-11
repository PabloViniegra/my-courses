import { UseFormReturn } from "react-hook-form";
import {
  Eye,
  Save,
  Upload,
  User,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category, CourseLevel } from "@/types";
import { CreateCourseFormData } from "@/types/forms";
import { formatPrice, getCourseLevelLabel } from "@/utils/mappers";

interface CoursePreviewSectionProps {
  form: UseFormReturn<CreateCourseFormData>;
  categories: Category[];
  isPending: boolean;
  publishAfterSave: boolean;
  watchedFields: CreateCourseFormData;
  onSaveDraft: () => void;
  onSaveAndPublish: () => void;
  onCancel: () => void;
}

export function CoursePreviewSection({
  categories,
  isPending,
  publishAfterSave,
  watchedFields,
  onSaveDraft,
  onSaveAndPublish,
  onCancel,
}: CoursePreviewSectionProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-sans text-lg">
          <Eye className="h-5 w-5" />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
          {watchedFields.thumbnail ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${watchedFields.thumbnail})`,
              }}
            />
          ) : null}
          <div
            className={`flex flex-col items-center justify-center h-full text-primary/60 ${
              watchedFields.thumbnail ? "hidden" : ""
            }`}
          >
            <ImageIcon className="h-12 w-12 mb-2" />
            <span className="text-sm font-medium">Course Thumbnail</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg font-sans line-clamp-2">
            {watchedFields.title || "Course Title"}
          </h3>
          <p className="text-sm text-muted-foreground font-serif line-clamp-3">
            {watchedFields.shortDesc || "Course description will appear here..."}
          </p>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-mono">
              {categories.find((cat) => cat.id === watchedFields.categoryId)
                ?.name || "Category"}
            </Badge>
            <span className="font-semibold text-lg text-primary">
              {formatPrice(watchedFields.price || 0, "USD")}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{getCourseLevelLabel(watchedFields.level as CourseLevel)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{publishAfterSave ? "Will be Published" : "Draft"}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-3">
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            onClick={onSaveDraft}
          >
            <Save className="h-4 w-4 mr-2" />
            {isPending ? "Creating..." : "Save as Draft"}
          </Button>
          <Button
            type="submit"
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isPending}
            onClick={onSaveAndPublish}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isPending ? "Publishing..." : "Save & Publish"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          * Choose &quot;Save as Draft&quot; to create privately, or &quot;Save &amp; Publish&quot; to
          make it live immediately
        </div>
      </CardContent>
    </Card>
  );
}