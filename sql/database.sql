-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- Para gen_random_uuid()

-- Crear ENUMs
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "ActivityType" AS ENUM ('LOGIN', 'COURSE_CREATED', 'COURSE_UPDATED', 'COURSE_ENROLLED', 'PROFILE_UPDATED');

-- Tabla users
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supabaseId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Tabla categories
CREATE TABLE "categories" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- Tabla subcategories
CREATE TABLE "subcategories" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id")
);

-- Tabla courses
CREATE TABLE "courses" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDesc" TEXT,
    "thumbnail" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "level" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "instructorId" TEXT NOT NULL,
    "categoryId" TEXT,
    "subcategoryId" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- Tabla lessons
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "duration" INTEGER,
    "order" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- Tabla enrollments
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- Tabla user_activities
CREATE TABLE "user_activities" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- Crear índices únicos
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_supabaseId_key" ON "users"("supabaseId");
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE UNIQUE INDEX "subcategories_slug_categoryId_key" ON "subcategories"("slug", "categoryId");
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");
CREATE UNIQUE INDEX "enrollments_userId_courseId_key" ON "enrollments"("userId", "courseId");

-- Crear índices para rendimiento
CREATE INDEX "idx_courses_status" ON "courses"("status");
CREATE INDEX "idx_courses_featured" ON "courses"("featured");
CREATE INDEX "idx_courses_instructor" ON "courses"("instructorId");
CREATE INDEX "idx_courses_category" ON "courses"("categoryId");
CREATE INDEX "idx_courses_subcategory" ON "courses"("subcategoryId");
CREATE INDEX "idx_lessons_course" ON "lessons"("courseId");
CREATE INDEX "idx_lessons_order" ON "lessons"("courseId", "order");
CREATE INDEX "idx_enrollments_user" ON "enrollments"("userId");
CREATE INDEX "idx_enrollments_course" ON "enrollments"("courseId");
CREATE INDEX "idx_user_activities_user" ON "user_activities"("userId");
CREATE INDEX "idx_user_activities_type" ON "user_activities"("type");

-- Añadir foreign keys
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "courses" ADD CONSTRAINT "courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "courses" ADD CONSTRAINT "courses_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Función para actualizar updatedAt automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para updatedAt
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON "categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON "subcategories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON "courses" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON "lessons" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON "enrollments" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo (categorías)
INSERT INTO "categories" ("id", "name", "slug", "description", "image") VALUES
('cat_dev_web', 'Desarrollo Web', 'desarrollo-web', 'Aprende a crear sitios web modernos y aplicaciones', '/images/categories/web-dev.jpg'),
('cat_data_sci', 'Ciencia de Datos', 'ciencia-datos', 'Análisis de datos, machine learning y estadística', '/images/categories/data-science.jpg'),
('cat_design', 'Diseño', 'diseno', 'Diseño gráfico, UX/UI y herramientas creativas', '/images/categories/design.jpg'),
('cat_marketing', 'Marketing Digital', 'marketing-digital', 'SEO, redes sociales y estrategias de marketing', '/images/categories/marketing.jpg'),
('cat_business', 'Negocios', 'negocios', 'Emprendimiento, finanzas y gestión empresarial', '/images/categories/business.jpg');

-- Insertar subcategorías
INSERT INTO "subcategories" ("id", "name", "slug", "categoryId") VALUES
('sub_frontend', 'Frontend', 'frontend', 'cat_dev_web'),
('sub_backend', 'Backend', 'backend', 'cat_dev_web'),
('sub_fullstack', 'Full Stack', 'full-stack', 'cat_dev_web'),
('sub_mobile', 'Mobile', 'mobile', 'cat_dev_web'),
('sub_python', 'Python', 'python', 'cat_data_sci'),
('sub_r', 'R', 'r', 'cat_data_sci'),
('sub_ml', 'Machine Learning', 'machine-learning', 'cat_data_sci'),
('sub_bigdata', 'Big Data', 'big-data', 'cat_data_sci'),
('sub_ux_ui', 'UX/UI', 'ux-ui', 'cat_design'),
('sub_graphic', 'Gráfico', 'grafico', 'cat_design'),
('sub_illustration', 'Ilustración', 'ilustracion', 'cat_design'),
('sub_seo', 'SEO', 'seo', 'cat_marketing'),
('sub_social', 'Redes Sociales', 'redes-sociales', 'cat_marketing'),
('sub_email', 'Email Marketing', 'email-marketing', 'cat_marketing'),
('sub_entrepreneur', 'Emprendimiento', 'emprendimiento', 'cat_business'),
('sub_finance', 'Finanzas', 'finanzas', 'cat_business'),
('sub_leadership', 'Liderazgo', 'liderazgo', 'cat_business');

-- Usuario administrador por defecto
INSERT INTO "users" ("id", "email", "name", "role", "emailVerified") VALUES
('admin_user_1', 'admin@coursesplatform.com', 'Administrador', 'ADMIN', CURRENT_TIMESTAMP);