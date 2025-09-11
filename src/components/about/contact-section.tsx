import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "info@eduplatform.com",
      description: "Respuesta en menos de 24 horas"
    },
    {
      icon: Phone,
      title: "Teléfono",
      details: "+34 900 123 456",
      description: "Lunes a Viernes: 9:00 - 18:00"
    },
    {
      icon: MapPin,
      title: "Oficina",
      details: "Madrid, España",
      description: "Calle Innovación 123, 28001"
    },
    {
      icon: Clock,
      title: "Horario de Atención",
      details: "L-V: 9:00 - 18:00",
      description: "Fines de semana: Cerrado"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-sans mb-4">
              Contáctanos
            </h2>
            <p className="text-lg text-muted-foreground font-serif max-w-2xl mx-auto">
              ¿Tienes preguntas? ¿Necesitas ayuda? ¿Quieres formar parte de nuestro equipo? 
              Estamos aquí para ayudarte en tu journey educativo.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-foreground font-sans mb-6">
                  Información de contacto
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <info.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="font-semibold text-foreground font-sans">
                              {info.title}
                            </h4>
                            <p className="font-medium text-primary">
                              {info.details}
                            </p>
                            <p className="text-sm text-muted-foreground font-serif">
                              {info.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-sans">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Preguntas Frecuentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground font-sans">
                      ¿Cómo puedo convertirme en instructor?
                    </h4>
                    <p className="text-muted-foreground font-serif text-sm">
                      Ponte en contacto con nosotros a través del formulario o por email. 
                      Te guiaremos en todo el proceso.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground font-sans">
                      ¿Ofrecen soporte técnico?
                    </h4>
                    <p className="text-muted-foreground font-serif text-sm">
                      Sí, nuestro equipo técnico está disponible de lunes a viernes 
                      para ayudarte con cualquier problema.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-sans">
                  Envíanos un mensaje
                </CardTitle>
                <p className="text-muted-foreground font-serif">
                  Completa el formulario y te responderemos lo antes posible.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input id="name" placeholder="Tu nombre completo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto *</Label>
                  <Input id="subject" placeholder="¿En qué podemos ayudarte?" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe tu consulta o comentario..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar mensaje
                  </Button>
                  <Button type="button" variant="outline">
                    Limpiar
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground font-serif">
                  * Campos obligatorios. Al enviar este formulario aceptas nuestra 
                  política de privacidad y el tratamiento de tus datos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}