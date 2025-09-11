import { GraduationCap, Users, BookOpen, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-sans tracking-tight">
              Transformamos el futuro de la 
              <span className="text-primary"> educación</span>
            </h1>
            <p className="text-xl text-muted-foreground font-serif leading-relaxed max-w-2xl mx-auto">
              Una plataforma moderna y accesible donde instructores apasionados 
              conectan con estudiantes motivados para crear experiencias de 
              aprendizaje extraordinarias.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            <Card className="border-0 bg-background/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <GraduationCap className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">1000+</p>
                  <p className="text-sm text-muted-foreground font-serif">Estudiantes</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-background/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">50+</p>
                  <p className="text-sm text-muted-foreground font-serif">Instructores</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-background/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">200+</p>
                  <p className="text-sm text-muted-foreground font-serif">Cursos</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-background/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">95%</p>
                  <p className="text-sm text-muted-foreground font-serif">Satisfacción</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}