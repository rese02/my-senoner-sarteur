import { getSession } from './session';

export type Language = 'de' | 'it' | 'en';

export interface MultilingualText {
  de: string;
  it: string;
  en: string;
}

export const translations = {
  de: {
    nav: {
      dashboard: "Entdecken",
      orders: "Bestellungen",
      concierge: "Concierge",
      planner: "Party Planer",
      loyalty: "Fidelity",
      sommelier: "AI Scan",
      profile: "Profil",
      cart: "Warenkorb",
      logout: "Abmelden"
    },
    dashboard: {
      storiesTitle: "Daily Stories",
      recipe_title: "Rezept der Woche",
      recipe_ingredients: "Zutaten",
      recipe_prep: "Zubereitung",
      btn_view_recipe: "Zum Rezept",
      active_order: "Offene Bestellung",
      openOrderDescription: "Ihre Bestellung ist",
      viewAllOrders: "Alle Bestellungen ansehen"
    },
    wheel: {
      title: "Ihr tägliches Glücksrad",
      description: "Drehen und gewinnen Sie tolle Preise – jeden Tag eine neue Chance!",
      button: "Jetzt drehen & gewinnen!",
      dialogTitle: "Viel Glück!",
      dialogDescription: "Klicken Sie auf 'Drehen', um Ihr Glück zu versuchen.",
      spinning: "Wird gedreht...",
      spin: "Drehen!",
      result: "Ihr Ergebnis:",
      close: "Schließen",
      toastWin: "Glückwunsch!",
      toastWinDescription: "Sie haben gewonnen: {prize}",
      toastLose: "Leider nichts...",
      toastLoseDescription: "Versuchen Sie es morgen wieder!",
      toastError: "Fehler"
    },
    cart: {
        title: "Ihre Vorbestellung",
        empty: "Ihr Warenkorb ist leer.",
        pickupDate: "Abholdatum",
        total: "Gesamt",
        orderButton: "Jetzt vorbestellen",
        toast: {
            successTitle: "Bestellung aufgegeben!",
            successDescription: "Wir haben Ihre Vorbestellung erhalten.",
            errorTitle: "Fehler",
            errorDescription: "Ihre Bestellung konnte nicht aufgegeben werden.",
            dateMissingTitle: "Abholdatum fehlt",
            dateMissingDescription: "Bitte wählen Sie ein gültiges Abholdatum.",
            dateTooSoonTitle: "Zu frühes Abholdatum",
            dateTooSoonDescription: "Bitte wählen Sie eine Zeit, die mindestens {hours} Stunden in der Zukunft liegt."
        }
    },
    product: {
        addToCart: "Hinzufügen",
        packageContent: "Inhalt",
        toast: {
            addedTitle: "Zum Warenkorb hinzugefügt"
        }
    },
    concierge: {
      title: "Concierge Service",
      description: "Ihr persönlicher Einkaufszettel & Lieferservice.",
      listTitle: "Ihr digitaler Einkaufszettel",
      listDescription: "Schreiben Sie einfach auf, was Sie benötigen. Wir stellen es zusammen und bringen es zum gewünschten Zeitpunkt.",
      listPlaceholder: "- 1L Frische Vollmilch\n- 200g Südtiroler Speck\n- 1 Laib Brot...",
      whatYouNeed: "Was darf es sein?",
      deliveryDetails: "Lieferdetails",
      deliveryDate: "Gewünschter Liefertag",
      street: "Straße & Hausnummer",
      streetPlaceholder: "Ihre Straße",
      city: "Ort",
      cityPlaceholder: "Ihr Ort",
      deliveryInfo: "Wir liefern nur nach Wolkenstein und St. Christina. Die Liefergebühr beträgt pauschal 5,00 €. Die Gesamtsumme wird Ihrem Kundenkonto zur späteren Bezahlung hinzugefügt.",
      submitButton: "Bestellung an Senoner Team senden",
      toast: {
          successTitle: "Bestellung abgeschickt!",
          successDescription: "Wir haben Ihren Einkaufszettel erhalten und werden ihn für Sie zusammenstellen.",
          errorTitle: "Fehler",
          errorDescription: "Ihre Bestellung konnte nicht gesendet werden.",
          listEmpty: "Ihr Einkaufszettel ist leer.",
          addressIncomplete: "Lieferadresse unvollständig.",
          dateMissing: "Lieferdatum fehlt.",
          datePast: "Das Lieferdatum darf nicht in der Vergangenheit liegen."
      }
    },
    orders: {
        title: "Meine Bestellungen",
        description: "Hier sehen Sie den Status Ihrer aktuellen und vergangenen Bestellungen.",
        preorder: "Vorbestellung",
        manage: "Verwalten",
        cancel: "Abbrechen",
        delete: "Löschen",
        deleteConfirmTitle: "Sind Sie sicher?",
        deleteConfirmDescription: "Möchten Sie die {count} ausgewählten Bestellungen wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
        deleteButton: "Ja, löschen",
        selectAll: "Alle {count} abgeschlossenen Bestellungen auswählen",
        noOrders: "Noch keine Bestellungen",
        noOrdersDescription: "Ihre Bestellungen werden hier angezeigt."
    },
    planner: {
        title: "Party Planer",
        description: "Wählen Sie ein Event und wir berechnen die perfekte Menge für Ihre Gäste.",
        selectEvent: "1. Event auswählen",
        setGuests: "2. Gästeanzahl festlegen",
        guests: "Wie viele Gäste erwarten Sie?",
        recommendation: "Empfehlung für {count} Personen:",
        addToCart: "Gesamtpaket in den Warenkorb",
        forPeople: "(für {count} Pers.)",
        toast: {
            addedTitle: "Hinzugefügt!",
            addedDescription: "Zutaten für \"{event}\" für {count} Personen im Warenkorb."
        }
    },
    profile: {
        title: "Mein Profil",
        description: "Verwalten Sie hier Ihre Kontodetails und Datenschutzeinstellungen.",
        personalInfo: "Persönliche Informationen",
        personalInfoDesc: "Die E-Mail-Adresse kann nicht geändert werden.",
        fullName: "Vollständiger Name",
        email: "E-Mail",
        phone: "Telefonnummer",
        deliveryAddress: "Lieferadresse",
        street: "Straße & Nr.",
        zip: "PLZ",
        city: "Ort",
        province: "Provinz",
        saveChanges: "Änderungen speichern",
        privacySettings: "Datenschutzeinstellungen",
        privacySettingsDesc: "Verwalten Sie hier Ihre Einwilligungen.",
        consentMarketing: "Newsletter & Angebote",
        consentMarketingDesc: "Erhalten Sie E-Mails über Neuigkeiten und Aktionen.",
        consentProfiling: "Personalisierte Empfehlungen",
        consentProfilingDesc: "Erlauben Sie uns, Ihre Einkäufe für bessere Vorschläge zu analysieren.",
        saveConsents: "Einwilligungen speichern",
        logout: "Abmelden",
        logoutDesc: "Beenden Sie Ihre aktuelle Sitzung.",
        dangerZone: "Gefahrenzone",
        dangerZoneDesc: "Diese Aktionen können nicht rückgängig gemacht werden.",
        deleteAccount: "Konto endgültig löschen",
        deleteAccountConfirmTitle: "Sind Sie absolut sicher?",
        deleteAccountConfirmDesc: "Diese Aktion kann nicht rückgängig gemacht werden. Ihr Konto, Ihre Bestellhistorie und Ihre Treuepunkte werden dauerhaft gelöscht.",
        deleteAccountButton: "Ja, mein Konto löschen",
        language: "Sprache / Lingua",
        toast: {
            profileSaved: "Profil erfolgreich aktualisiert.",
            consentSaved: "Einwilligungen gespeichert.",
            error: "Aktualisierung fehlgeschlagen."
        }
    },
    loyalty: {
        title: "Fidelity",
        description: "Zeigen Sie Ihren QR-Code an der Kasse, um Stempel zu sammeln und Belohnungen einzulösen.",
        qrTitle: "Ihr QR-Code",
        activePrize: "Aktiver Gewinn (Glücksrad)",
        activePrizeDesc: "Zeigen Sie dies an der Kasse!",
        stampsCard: "Stempelkarte",
        stampsCardDesc: "Jeder Stempel ist ein Schritt näher an Ihrer nächsten Belohnung.",
        rewardsTitle: "Stempel-Belohnungen",
        rewardsDesc: "Sammeln Sie Stempel für tolle Rabatte!",
        reward3Euro: "3€ Rabatt",
        stamps5: "5 Stempel",
        readyToRedeem: "Bereit zum Einlösen!",
        orSaveFor: "(Oder weiter sparen für 7€)",
        reward7Euro: "7€ Rabatt (Super-Bonus)",
        stamps10: "10 Stempel",
        maxReward: "Maximale Belohnung erreicht! An der Kasse einlösbar."
    },
    sommelier: {
        title: "AI Sommelier",
        close: "Schließen",
        takePhoto: "Take Photo",
        analyzing: "Analysiere Aromen...",
        analyzingDesc: "Ihre Aufnahme wird von einem KI-Dienst verarbeitet, um passende Weine vorzuschlagen.",
        detectedFood: "Erkanntes Gericht:",
        recommendations: "Passende Weinempfehlungen:",
        startNewScan: "Neuen Scan starten",
        alertTitle: "KI-Vorschlag",
        alertDescription: "Dieser Vorschlag basiert auf künstlicher Intelligenz und kann Fehler enthalten. Prüfen Sie Allergene stets auf der Verpackung."
    },
    status: {
      new: "Eingegangen",
      picking: "Wird gepackt",
      ready: "Abholbereit",
      ready_for_delivery: "Lieferbereit",
      delivered: "Geliefert",
      collected: "Abgeholt",
      paid: "Bezahlt",
      cancelled: "Storniert"
    },
    datePicker: {
        placeholder: "Wählen Sie ein Datum"
    },
    common: {
      loading: "Lade...",
      back: "Zurück",
      save: "Speichern",
      logout: "Abmelden",
      total: "Gesamt",
      impressum: "Impressum",
      privacy: "Datenschutz"
    }
  },
  it: {
    nav: {
      dashboard: "Scopri",
      orders: "Ordini",
      concierge: "Lista spesa",
      planner: "Party Planner",
      loyalty: "Fidelity",
      sommelier: "AI Scan",
      profile: "Profilo",
      cart: "Carrello",
      logout: "Esci"
    },
    dashboard: {
      storiesTitle: "Daily Stories",
      recipe_title: "Ricetta della settimana",
      recipe_ingredients: "Ingredienti",
      recipe_prep: "Preparazione",
      btn_view_recipe: "Vedi ricetta",
      active_order: "Ordine attivo",
      openOrderDescription: "Il tuo ordine è",
      viewAllOrders: "Vedi tutti gli ordini"
    },
    wheel: {
        title: "La tua Ruota della Fortuna",
        description: "Gira e vinci fantastici premi – una nuova chance ogni giorno!",
        button: "Gira e vinci!",
        dialogTitle: "Buona fortuna!",
        dialogDescription: "Clicca su 'Gira' per tentare la fortuna.",
        spinning: "Gira...",
        spin: "Gira!",
        result: "Il tuo risultato:",
        close: "Chiudi",
        toastWin: "Congratulazioni!",
        toastWinDescription: "Hai vinto: {prize}",
        toastLose: "Peccato...",
        toastLoseDescription: "Riprova domani!",
        toastError: "Errore"
    },
    cart: {
        title: "Il tuo pre-ordine",
        empty: "Il tuo carrello è vuoto.",
        pickupDate: "Data di ritiro",
        total: "Totale",
        orderButton: "Pre-ordina ora",
        toast: {
            successTitle: "Ordine inviato!",
            successDescription: "Abbiamo ricevuto il tuo pre-ordine.",
            errorTitle: "Errore",
            errorDescription: "Impossibile inviare il tuo ordine.",
            dateMissingTitle: "Data di ritiro mancante",
            dateMissingDescription: "Seleziona una data di ritiro valida.",
            dateTooSoonTitle: "Data di ritiro troppo vicina",
            dateTooSoonDescription: "Seleziona una data che sia almeno {hours} ore nel futuro."
        }
    },
    product: {
        addToCart: "Aggiungi",
        packageContent: "Contenuto",
        toast: {
            addedTitle: "Aggiunto al carrello"
        }
    },
    concierge: {
      title: "Servizio Concierge",
      description: "La tua lista della spesa e servizio di consegna personale.",
      listTitle: "La tua lista della spesa digitale",
      listDescription: "Scrivi semplicemente ciò di cui hai bisogno. Lo prepareremo per te e lo consegneremo all'orario desiderato.",
      listPlaceholder: "- 1L Latte fresco\n- 200g Speck Alto Adige\n- 1 Pane...",
      whatYouNeed: "Cosa possiamo portarti?",
      deliveryDetails: "Dettagli di consegna",
      deliveryDate: "Giorno di consegna desiderato",
      street: "Via e numero civico",
      streetPlaceholder: "La tua via",
      city: "Località",
      cityPlaceholder: "La tua località",
      deliveryInfo: "Consegniamo solo a Selva e S. Cristina. Il costo di consegna è di 5,00 €. L'importo totale verrà aggiunto al tuo account cliente per il pagamento successivo.",
      submitButton: "Invia ordine al team Senoner",
      toast: {
          successTitle: "Ordine spedito!",
          successDescription: "Abbiamo ricevuto la tua lista della spesa e la prepareremo per te.",
          errorTitle: "Errore",
          errorDescription: "Impossibile inviare il tuo ordine.",
          listEmpty: "La tua lista della spesa è vuota.",
          addressIncomplete: "Indirizzo di consegna incompleto.",
          dateMissing: "Data di consegna mancante.",
          datePast: "La data di consegna non può essere nel passato."
      }
    },
    orders: {
        title: "I miei ordini",
        description: "Qui puoi vedere lo stato dei tuoi ordini attuali e passati.",
        preorder: "Pre-ordine",
        manage: "Gestisci",
        cancel: "Annulla",
        delete: "Elimina",
        deleteConfirmTitle: "Sei assolutamente sicuro?",
        deleteConfirmDescription: "Vuoi davvero eliminare i {count} ordini selezionati? Questa azione non può essere annullata.",
        deleteButton: "Sì, elimina",
        selectAll: "Seleziona tutti i {count} ordini completati",
        noOrders: "Nessun ordine ancora",
        noOrdersDescription: "I tuoi ordini verranno visualizzati qui."
    },
    planner: {
        title: "Party Planner",
        description: "Scegli un evento e calcoleremo la quantità perfetta per i tuoi ospiti.",
        selectEvent: "1. Scegli un evento",
        setGuests: "2. Imposta il numero di ospiti",
        guests: "Quanti ospiti aspetti?",
        recommendation: "Raccomandazione per {count} persone:",
        addToCart: "Aggiungi pacchetto al carrello",
        forPeople: "(per {count} pers.)",
        toast: {
            addedTitle: "Aggiunto!",
            addedDescription: "Ingredienti per \"{event}\" per {count} persone nel carrello."
        }
    },
    profile: {
        title: "Il mio profilo",
        description: "Gestisci i dettagli del tuo account e le impostazioni sulla privacy.",
        personalInfo: "Informazioni personali",
        personalInfoDesc: "L'indirizzo email non può essere modificato.",
        fullName: "Nome completo",
        email: "E-mail",
        phone: "Numero di telefono",
        deliveryAddress: "Indirizzo di consegna",
        street: "Via e n.",
        zip: "CAP",
        city: "Località",
        province: "Provincia",
        saveChanges: "Salva modifiche",
        privacySettings: "Impostazioni privacy",
        privacySettingsDesc: "Gestisci qui i tuoi consensi.",
        consentMarketing: "Newsletter e offerte",
        consentMarketingDesc: "Ricevi e-mail su novità e promozioni.",
        consentProfiling: "Consigli personalizzati",
        consentProfilingDesc: "Permettici di analizzare i tuoi acquisti per suggerimenti migliori.",
        saveConsents: "Salva consensi",
        logout: "Esci",
        logoutDesc: "Termina la sessione corrente.",
        dangerZone: "Zona pericolosa",
        dangerZoneDesc: "Queste azioni non possono essere annullate.",
        deleteAccount: "Elimina account in modo permanente",
        deleteAccountConfirmTitle: "Sei assolutamente sicuro?",
        deleteAccountConfirmDesc: "Questa azione non può essere annullata. Il tuo account, la cronologia degli ordini e i punti fedeltà verranno eliminati in modo permanente.",
        deleteAccountButton: "Sì, elimina il mio account",
        language: "Lingua / Sprache",
        toast: {
            profileSaved: "Profilo aggiornato con successo.",
            consentSaved: "Consensi salvati.",
            error: "Aggiornamento fallito."
        }
    },
    loyalty: {
        title: "Fidelity",
        description: "Mostra il tuo codice QR alla cassa per raccogliere timbri e riscattare premi.",
        qrTitle: "Il tuo codice QR",
        activePrize: "Premio attivo (Ruota della Fortuna)",
        activePrizeDesc: "Mostra questo alla cassa!",
        stampsCard: "Scheda punti",
        stampsCardDesc: "Ogni timbro è un passo verso il tuo prossimo premio.",
        rewardsTitle: "Premi fedeltà",
        rewardsDesc: "Raccogli i timbri per fantastici sconti!",
        reward3Euro: "Sconto di 3€",
        stamps5: "5 timbri",
        readyToRedeem: "Pronto per essere riscosso!",
        orSaveFor: "(O continua a raccogliere per 7€)",
        reward7Euro: "Sconto di 7€ (Super Bonus)",
        stamps10: "10 timbri",
        maxReward: "Massima ricompensa raggiunta! Riscattabile alla cassa."
    },
    sommelier: {
        title: "Sommelier AI",
        close: "Chiudi",
        takePhoto: "Scatta foto",
        analyzing: "Analisi degli aromi...",
        analyzingDesc: "La tua foto viene elaborata da un servizio di intelligenza artificiale per suggerire i vini adatti.",
        detectedFood: "Piatto rilevato:",
        recommendations: "Vini consigliati:",
        startNewScan: "Inizia una nuova scansione",
        alertTitle: "Suggerimento AI",
        alertDescription: "Questo suggerimento si basa sull'intelligenza artificiale e può contenere errori. Controllare sempre gli allergeni sulla confezione."
    },
    status: {
      new: "Ricevuto",
      picking: "In preparazione",
      ready: "Pronto per il ritiro",
      ready_for_delivery: "Pronto per la consegna",
      delivered: "Consegnato",
      collected: "Ritirato",
      paid: "Pagato",
      cancelled: "Annullato"
    },
    datePicker: {
        placeholder: "Scegli una data"
    },
    common: {
      loading: "Caricamento...",
      back: "Indietro",
      save: "Salva",
      logout: "Esci",
      total: "Totale",
      impressum: "Note Legali",
      privacy: "Privacy"
    }
  },
  en: {
    nav: {
      dashboard: "Discover",
      orders: "Orders",
      concierge: "Shopping List",
      planner: "Party Planner",
      loyalty: "Fidelity",
      sommelier: "AI Scan",
      profile: "Profile",
      cart: "Cart",
      logout: "Log out"
    },
    dashboard: {
      storiesTitle: "Daily Stories",
      recipe_title: "Recipe of the Week",
      recipe_ingredients: "Ingredients",
      recipe_prep: "Preparation",
      btn_view_recipe: "View Recipe",
      active_order: "Active Order",
      openOrderDescription: "Your order is",
      viewAllOrders: "View all orders"
    },
    wheel: {
        title: "Your Daily Wheel of Fortune",
        description: "Spin and win great prizes – a new chance every day!",
        button: "Spin & Win Now!",
        dialogTitle: "Good Luck!",
        dialogDescription: "Click 'Spin' to try your luck.",
        spinning: "Spinning...",
        spin: "Spin!",
        result: "Your result:",
        close: "Close",
        toastWin: "Congratulations!",
        toastWinDescription: "You won: {prize}",
        toastLose: "Too bad...",
        toastLoseDescription: "Try again tomorrow!",
        toastError: "Error"
    },
    cart: {
        title: "Your Pre-Order",
        empty: "Your cart is empty.",
        pickupDate: "Pickup Date",
        total: "Total",
        orderButton: "Pre-Order Now",
        toast: {
            successTitle: "Order placed!",
            successDescription: "We have received your pre-order.",
            errorTitle: "Error",
            errorDescription: "Your order could not be placed.",
            dateMissingTitle: "Pickup date missing",
            dateMissingDescription: "Please select a valid pickup date.",
            dateTooSoonTitle: "Pickup date too soon",
            dateTooSoonDescription: "Please select a time that is at least {hours} hours in the future."
        }
    },
    product: {
        addToCart: "Add to cart",
        packageContent: "Contents",
        toast: {
            addedTitle: "Added to cart"
        }
    },
    concierge: {
      title: "Concierge Service",
      description: "Your personal shopping list & delivery service.",
      listTitle: "Your Digital Shopping List",
      listDescription: "Just write down what you need. We'll put it together and deliver it at your desired time.",
      listPlaceholder: "- 1L Fresh Milk\n- 200g South Tyrolean Speck\n- 1 Loaf of bread...",
      whatYouNeed: "What can we get for you?",
      deliveryDetails: "Delivery Details",
      deliveryDate: "Desired Delivery Day",
      street: "Street & House Number",
      streetPlaceholder: "Your street",
      city: "City",
      cityPlaceholder: "Your city",
      deliveryInfo: "We only deliver to Selva and S. Cristina. The delivery fee is a flat rate of €5.00. The total amount will be added to your customer account for later payment.",
      submitButton: "Send Order to Senoner Team",
      toast: {
          successTitle: "Order sent!",
          successDescription: "We have received your shopping list and will prepare it for you.",
          errorTitle: "Error",
          errorDescription: "Your order could not be sent.",
          listEmpty: "Your shopping list is empty.",
          addressIncomplete: "Delivery address incomplete.",
          dateMissing: "Delivery date is missing.",
          datePast: "The delivery date cannot be in the past."
      }
    },
    orders: {
        title: "My Orders",
        description: "Here you can see the status of your current and past orders.",
        preorder: "Pre-order",
        manage: "Manage",
        cancel: "Cancel",
        delete: "Delete",
        deleteConfirmTitle: "Are you absolutely sure?",
        deleteConfirmDescription: "Do you really want to delete the {count} selected orders? This action cannot be undone.",
        deleteButton: "Yes, delete",
        selectAll: "Select all {count} completed orders",
        noOrders: "No orders yet",
        noOrdersDescription: "Your orders will be displayed here."
    },
    planner: {
        title: "Party Planner",
        description: "Choose an event and we'll calculate the perfect amount for your guests.",
        selectEvent: "1. Select Event",
        setGuests: "2. Set Number of Guests",
        guests: "How many guests are you expecting?",
        recommendation: "Recommendation for {count} people:",
        addToCart: "Add Package to Cart",
        forPeople: "(for {count} people)",
        toast: {
            addedTitle: "Added!",
            addedDescription: "Ingredients for \"{event}\" for {count} people in cart."
        }
    },
    profile: {
        title: "My Profile",
        description: "Manage your account details and privacy settings here.",
        personalInfo: "Personal Information",
        personalInfoDesc: "The email address cannot be changed.",
        fullName: "Full Name",
        email: "E-mail",
        phone: "Phone Number",
        deliveryAddress: "Delivery Address",
        street: "Street & No.",
        zip: "ZIP Code",
        city: "City",
        province: "Province",
        saveChanges: "Save Changes",
        privacySettings: "Privacy Settings",
        privacySettingsDesc: "Manage your consents here.",
        consentMarketing: "Newsletter & Offers",
        consentMarketingDesc: "Receive emails about news and promotions.",
        consentProfiling: "Personalized Recommendations",
        consentProfilingDesc: "Allow us to analyze your purchases for better suggestions.",
        saveConsents: "Save Consents",
        logout: "Log Out",
        logoutDesc: "End your current session.",
        dangerZone: "Danger Zone",
        dangerZoneDesc: "These actions cannot be undone.",
        deleteAccount: "Delete Account Permanently",
        deleteAccountConfirmTitle: "Are you absolutely sure?",
        deleteAccountConfirmDesc: "This action cannot be undone. Your account, order history, and loyalty points will be permanently deleted.",
        deleteAccountButton: "Yes, delete my account",
        language: "Language / Sprache",
        toast: {
            profileSaved: "Profile updated successfully.",
            consentSaved: "Consents saved.",
            error: "Update failed."
        }
    },
    loyalty: {
        title: "Fidelity",
        description: "Show your QR code at the checkout to collect stamps and redeem rewards.",
        qrTitle: "Your QR Code",
        activePrize: "Active Prize (Wheel of Fortune)",
        activePrizeDesc: "Show this at the checkout!",
        stampsCard: "Stamp Card",
        stampsCardDesc: "Every stamp is a step closer to your next reward.",
        rewardsTitle: "Stamp Rewards",
        rewardsDesc: "Collect stamps for great discounts!",
        reward3Euro: "€3 Discount",
        stamps5: "5 Stamps",
        readyToRedeem: "Ready to redeem!",
        orSaveFor: "(Or keep saving for €7)",
        reward7Euro: "€7 Discount (Super Bonus)",
        stamps10: "10 Stamps",
        maxReward: "Maximum reward reached! Redeemable at checkout."
    },
    sommelier: {
        title: "AI Sommelier",
        close: "Close",
        takePhoto: "Take Photo",
        analyzing: "Analyzing aromas...",
        analyzingDesc: "Your picture is being processed by an AI service to suggest suitable wines.",
        detectedFood: "Detected dish:",
        recommendations: "Matching wine recommendations:",
        startNewScan: "Start New Scan",
        alertTitle: "AI Suggestion",
        alertDescription: "This suggestion is based on artificial intelligence and may contain errors. Always check allergens on the packaging."
    },
    status: {
      new: "Received",
      picking: "Packing",
      ready: "Ready for Pickup",
      ready_for_delivery: "Ready for Delivery",
      delivered: "Delivered",
      collected: "Collected",
      paid: "Paid",
      cancelled: "Cancelled"
    },
    datePicker: {
        placeholder: "Pick a date"
    },
    common: {
      loading: "Loading...",
      back: "Back",
      save: "Save",
      logout: "Log out",
      total: "Total",
      impressum: "Impressum",
      privacy: "Privacy"
    }
  }
};

// This function can be used on the server to get the translations
// based on the user's session or default language.
export async function getTranslations(lang?: Language) {
  if (lang) {
    return translations[lang];
  }
  // If no language is provided, try to get it from the session
  // This part needs a way to get the user's preferred language,
  // which might be stored in the session or requested from headers.
  // For simplicity, we'll default to German on the server.
  return translations['de'];
}
