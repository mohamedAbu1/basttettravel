"use client";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

const questions = {
  en: { eyebrow: "Before you go", title: "Frequently asked questions", items: [["What is included in this trip?", "Open the Includes section above to see what is covered. Items listed under Exclusions are not part of the displayed price."], ["Can I customize the itinerary?", "Yes. Contact Basttet Travel before booking and tell us what you would like to add, remove or change."], ["How do I choose my dates?", "Add the number of adults or children in the booking card, then choose an available check-in and check-out date."], ["Do I need an account to book?", "An account is required to complete a booking and payment. You can create one when you start the booking process."]] },
  de: { eyebrow: "Vor Ihrer Reise", title: "Häufig gestellte Fragen", items: [["Was ist in dieser Reise enthalten?", "Im Abschnitt Enthält sehen Sie alle Leistungen. Die unter Ausschlüsse aufgeführten Punkte sind nicht im Preis enthalten."], ["Kann ich die Route anpassen?", "Ja. Kontaktieren Sie Basttet Travel vor der Buchung mit Ihren Änderungswünschen."], ["Wie wähle ich die Termine?", "Wählen Sie im Buchungsfeld die Reisenden und anschließend verfügbare An- und Abreisetermine."], ["Benötige ich ein Konto?", "Für Buchung und Zahlung ist ein Konto erforderlich. Sie können es während der Buchung erstellen."]] },
  es: { eyebrow: "Antes de viajar", title: "Preguntas frecuentes", items: [["¿Qué incluye este viaje?", "Consulta la sección Incluye para ver los servicios cubiertos. Lo indicado en Exclusiones no está incluido."], ["¿Puedo personalizar el itinerario?", "Sí. Contacta con Basttet Travel antes de reservar para solicitar cambios."], ["¿Cómo elijo las fechas?", "Añade los viajeros en la tarjeta de reserva y selecciona las fechas disponibles."], ["¿Necesito una cuenta?", "Se necesita una cuenta para completar la reserva y el pago."]] },
  fr: { eyebrow: "Avant de partir", title: "Questions fréquentes", items: [["Que comprend ce voyage ?", "Consultez la section Inclus pour voir les prestations couvertes. Les exclusions ne sont pas comprises dans le prix."], ["Puis-je personnaliser l'itinéraire ?", "Oui. Contactez Basttet Travel avant la réservation pour demander des modifications."], ["Comment choisir mes dates ?", "Ajoutez les voyageurs dans la carte de réservation, puis choisissez les dates disponibles."], ["Ai-je besoin d'un compte ?", "Un compte est nécessaire pour finaliser la réservation et le paiement."]] },
  it: { eyebrow: "Prima di partire", title: "Domande frequenti", items: [["Cosa include questo viaggio?", "Consulta la sezione Include per vedere i servizi coperti. Le esclusioni non sono comprese nel prezzo."], ["Posso personalizzare l'itinerario?", "Sì. Contatta Basttet Travel prima della prenotazione per richiedere modifiche."], ["Come scelgo le date?", "Aggiungi i viaggiatori nella scheda di prenotazione e scegli le date disponibili."], ["Serve un account?", "È necessario un account per completare prenotazione e pagamento."]] },
  zh: { eyebrow: "出发前须知", title: "常见问题", items: [["行程包含哪些内容？", "请查看包含项目部分。排除项目不包含在显示的价格中。"], ["可以定制行程吗？", "可以。请在预订前联系 Basttet Travel，告诉我们您的修改需求。"], ["如何选择日期？", "在预订卡片中添加旅客人数，然后选择可用的日期。"], ["需要账户吗？", "完成预订和付款需要账户，您可以在预订过程中创建账户。"]] },
};

export default function TripFAQ() {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const content = questions[i18n.language?.split("-")[0]] || questions.en;

  return (
    <section className={ " rounded-2xl border border-[#d4b56f]/25 p-6 " + theme.text} aria-labelledby="trip-faq-title">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b56f]">{content.eyebrow}</p>
      <h2 id="trip-faq-title" className="mt-2 text-2xl font-bold">{content.title}</h2>
      <div className="mt-5 divide-y divide-[#d4b56f]/15">
        {content.items.map(([question, answer]) => (
          <details key={question} className="group py-4">
            <summary className="cursor-pointer list-none pr-8 font-semibold marker:hidden">
              <span className="relative block">{question}<span className="absolute right-0 text-[#d4b56f] transition group-open:rotate-45">+</span></span>
            </summary>
            <p className={"mt-3 max-w-3xl text-sm leading-7 " + theme.subText}>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
