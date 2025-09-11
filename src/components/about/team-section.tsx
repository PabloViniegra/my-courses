import { Github, Linkedin, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TeamSection() {
  const team = [
    {
      name: "Ana García",
      role: "CEO & Fundadora",
      bio: "Experta en tecnología educativa con más de 10 años de experiencia en el desarrollo de plataformas de aprendizaje.",
      avatar: null,
      social: {
        linkedin: "#",
        github: "#",
        email: "ana@eduplatform.com"
      }
    },
    {
      name: "Carlos Rodríguez",
      role: "CTO & Co-fundador",
      bio: "Desarrollador full-stack apasionado por crear soluciones tecnológicas que impacten positivamente en la educación.",
      avatar: null,
      social: {
        linkedin: "#",
        github: "#",
        email: "carlos@eduplatform.com"
      }
    },
    {
      name: "María López",
      role: "Directora de Contenido",
      bio: "Pedagoga y experta en diseño curricular, se encarga de asegurar la calidad educativa de todos nuestros cursos.",
      avatar: null,
      social: {
        linkedin: "#",
        github: "#",
        email: "maria@eduplatform.com"
      }
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-sans mb-4">
              Conoce a nuestro equipo
            </h2>
            <p className="text-lg text-muted-foreground font-serif max-w-2xl mx-auto">
              Un grupo de profesionales apasionados por la educación y la tecnología, 
              comprometidos con crear la mejor experiencia de aprendizaje.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8 space-y-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground font-sans">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium font-sans">
                      {member.role}
                    </p>
                  </div>
                  
                  <p className="text-muted-foreground font-serif leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div className="flex justify-center gap-3 pt-4">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Github className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}