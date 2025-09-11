import { UseFormReturn } from "react-hook-form";
import { Tag, DollarSign, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
} from "@/components/ui/file-upload";
import { Category, COURSE_LEVELS } from "@/types";
import { CreateCourseFormData } from "@/types/forms";

interface CourseDetailsSectionProps {
  form: UseFormReturn<CreateCourseFormData>;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  thumbnailFiles: File[];
  onThumbnailUpload: (files: File[]) => void;
}

export function CourseDetailsSection({
  form,
  categories,
  selectedCategory,
  onCategoryChange,
  thumbnailFiles,
  onThumbnailUpload,
}: CourseDetailsSectionProps) {
  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-sans">
          <Tag className="h-5 w-5" />
          Course Details
        </CardTitle>
        <p className="text-sm text-muted-foreground font-serif">
          Categorization and pricing information for your course.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onCategoryChange(value);
                    form.setValue("subcategoryId", "");
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger disabled={!selectedCategory}>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedCategoryData?.subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Optional: Choose a specific subcategory
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(COURSE_LEVELS).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD) *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-9"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      value={field.value || 0}
                    />
                  </div>
                </FormControl>
                <FormDescription>Set to 0 to make the course free</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="thumbnail"
          render={() => (
            <FormItem>
              <FormLabel>Course Thumbnail</FormLabel>
              <FormControl>
                <FileUpload
                  value={thumbnailFiles}
                  onValueChange={onThumbnailUpload}
                  onAccept={onThumbnailUpload}
                  accept="image/*"
                  maxFiles={1}
                  maxSize={5 * 1024 * 1024} // 5MB
                  className="w-full"
                >
                  <FileUploadDropzone className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors min-h-[120px]">
                    <div className="flex flex-col items-center justify-center gap-2 p-6">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          Arrastra una imagen aquí o haz clic para seleccionar
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF, WebP (max 5MB)
                        </p>
                      </div>
                      <FileUploadTrigger asChild>
                        <span className="text-sm font-medium text-primary cursor-pointer hover:underline">
                          Seleccionar Archivo
                        </span>
                      </FileUploadTrigger>
                    </div>
                  </FileUploadDropzone>
                  <FileUploadList className="mt-4">
                    <FileUploadItem value={thumbnailFiles[0]}>
                      <FileUploadItemPreview />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete />
                    </FileUploadItem>
                  </FileUploadList>
                </FileUpload>
              </FormControl>
              <FormDescription>
                Upload an image that represents your course. Max size: 5MB
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}