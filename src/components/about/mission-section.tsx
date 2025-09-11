import { Target, Heart, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MissionSection() {
  const values = [
    {
      icon: Target,
      title: "Nuestra Misión",
      description: "Democratizar el acceso a la educación de calidad, conectando a instructores expertos con estudiantes de todo el mundo a través de una plataforma tecnológica innovadora y fácil de usar."
    },
    {
      icon: Heart,
      title: "Nuestros Valores",
      description: "Creemos en la pasión por aprender, la excelencia en la enseñanza, la accesibilidad universal, la innovación constante y la construcción de una comunidad educativa inclusiva y colaborativa."
    },
    {
      icon: Lightbulb,
      title: "Nuestra Visión",
      description: "Ser la plataforma de aprendizaje en línea líder en España, reconocida por transformar vidas a través de la educación personalizada y de alta calidad, adaptada a las necesidades del siglo XXI."
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-sans mb-4">
              Impulsamos el cambio a través de la educación
            </h2>
            <p className="text-lg text-muted-foreground font-serif max-w-2xl mx-auto">
              Nuestra plataforma nace de la convicción de que la educación debe ser 
              accesible, personalizada y orientada al futuro.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold font-sans">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-serif leading-relaxed text-center">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}