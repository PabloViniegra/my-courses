"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  BookOpen,
  Save,
  Eye,
  Tag,
  DollarSign,
  User,
  FileText,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createCourse } from "@/app/private/create-course/actions";
import { Category, CourseLevel, COURSE_LEVELS } from "@/types";

const createCourseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  shortDesc: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(200),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000),
  price: z.number().min(0, "Price cannot be negative"),
  categoryId: z.string().min(1, "Please select a category"),
  subcategoryId: z.string().optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  thumbnail: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type CreateCourseFormData = z.infer<typeof createCourseSchema>;

interface CreateCourseFormProps {
  categories: Category[];
}

export function CreateCourseForm({ categories }: CreateCourseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [publishAfterSave, setPublishAfterSave] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const form = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      shortDesc: "",
      description: "",
      price: 0,
      categoryId: "",
      subcategoryId: "",
      level: "Beginner",
      thumbnail: "",
    },
  });

  const watchedFields = form.watch();
  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  const onSubmit = (data: CreateCourseFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            formData.append(key, value.toString());
          }
        });

        formData.append("publish", publishAfterSave.toString());

        const result = await createCourse(formData);

        if (result.success) {
          const statusText = publishAfterSave
            ? "published"
            : "created as draft";
          toast.success(`Course ${statusText} successfully!`);
          router.push(`/courses/${result.course?.slug}`);
        } else {
          toast.error(result.error || "Failed to create course");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        console.error("Form submission error:", error);
      }
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sans">
                  <BookOpen className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <p className="text-sm text-muted-foreground font-serif">
                  Essential details about your course that students will see
                  first.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Complete React Development Course"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, descriptive title that explains what students
                        will learn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDesc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief overview of what students will learn in this course..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Brief summary shown in course cards and search results
                        (max 200 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed description of your course content, learning objectives, prerequisites, and what makes it unique..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Detailed course description shown on the course page
                        (max 2000 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

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
                            setSelectedCategory(value);
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger disabled={!selectedCategory}>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedCategoryData?.subcategories.map(
                              (subcategory) => (
                                <SelectItem
                                  key={subcategory.id}
                                  value={subcategory.id}
                                >
                                  {subcategory.name}
                                </SelectItem>
                              )
                            ) || []}
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(COURSE_LEVELS).map(
                              ([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value}
                                </SelectItem>
                              )
                            )}
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
                        <FormDescription>
                          Set to 0 to make the course free
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail Image URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Optional: URL to an image that represents your course
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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
                    <span className="text-sm font-medium">
                      Course Thumbnail
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg font-sans line-clamp-2">
                    {watchedFields.title || "Course Title"}
                  </h3>
                  <p className="text-sm text-muted-foreground font-serif line-clamp-3">
                    {watchedFields.shortDesc ||
                      "Course description will appear here..."}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-mono">
                      {categories.find(
                        (cat) => cat.id === watchedFields.categoryId
                      )?.name || "Category"}
                    </Badge>
                    <span className="font-semibold text-lg text-primary">
                      {formatPrice(watchedFields.price || 0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>
                        {COURSE_LEVELS[watchedFields.level as CourseLevel] ||
                          "Beginner"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>
                        {publishAfterSave ? "Will be Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending}
                    onClick={() => setPublishAfterSave(false)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isPending ? "Creating..." : "Save as Draft"}
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isPending}
                    onClick={() => setPublishAfterSave(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isPending ? "Publishing..." : "Save & Publish"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground font-mono">
                  * Choose &quot;Save as Draft&quot; to create privately, or &quot;Save &amp;
                  Publish&quot; to make it live immediately
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
