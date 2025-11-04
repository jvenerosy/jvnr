const { jsPDF } = require('jspdf');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const loadPricingData = () => {
  const candidates = [
    path.join(__dirname, 'src', 'data', 'pricing.json'),
    path.join(process.cwd(), 'src', 'data', 'pricing.json'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const content = fs.readFileSync(candidate, 'utf8');
      return JSON.parse(content);
    }
  }

  throw new Error('Impossible de charger src/data/pricing.json');
};

const pricingData = loadPricingData();

class ContractPDFGenerator {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
  }

  addHeader(doc) {
    // Logo/Nom de l'entreprise
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('JVNR', this.margin, 30);
    
    // Sous-titre
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Créateur de solutions digitales', this.margin, 38);
    
    // Ligne de séparation
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(this.margin, 45, this.pageWidth - this.margin, 45);
  }

  addContractTitle(doc, planName) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const title = `CONTRAT DE PRESTATION - ${planName.toUpperCase()}`;
    const titleWidth = doc.getTextWidth(title);
    const titleX = (this.pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 65);
  }

  addContractInfo(doc, contractData) {
    let yPos = 85;
    
    // Informations du contrat
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    
    // Colonne gauche - Prestataire
    doc.text('PRESTATAIRE :', this.margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('JVNR', this.margin, yPos);
    yPos += 5;
    doc.text('Créateur de solutions digitales', this.margin, yPos);
    yPos += 5;
    doc.text('SIRET : 53273637800029', this.margin, yPos);
    yPos += 5;
    doc.text('Email : contact@jvnr.fr', this.margin, yPos);
    yPos += 5;
    doc.text('Site web : https://jvnr.fr', this.margin, yPos);
    
    // Colonne droite - Client
    yPos = 85;
    const rightColumnX = this.pageWidth / 2 + 10;
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT :', rightColumnX, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(contractData.clientName, rightColumnX, yPos);
    yPos += 5;
    if (contractData.clientSiret) {
      doc.text(`SIRET : ${contractData.clientSiret}`, rightColumnX, yPos);
      yPos += 5;
    }
    doc.text(contractData.clientEmail, rightColumnX, yPos);
    yPos += 5;
    
    // Adresse client
    const addressLines = contractData.clientAddress.split('\n');
    for (const line of addressLines) {
      doc.text(line, rightColumnX, yPos);
      yPos += 5;
    }
    
    // Informations du contrat
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`N° de contrat : ${contractData.contractNumber}`, this.margin, yPos);
    yPos += 5;
    doc.text(`Date : ${contractData.contractDate}`, this.margin, yPos);
  }

  addPlanDetails(doc, contractData) {
    const plan = contractData.plan;
    let yPos = 160;
    
    // Titre de la section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('DÉTAILS DE LA PRESTATION', this.margin, yPos);
    
    // Calculer la hauteur nécessaire pour le contenu
    const featuresCount = plan.features.length;
    const baseHeight = contractData.discount ? 55 : 45; // Plus de hauteur si remise
    const featuresHeight = (featuresCount * 4) + 10; // 4mm par feature + marge
    const totalHeight = baseHeight + featuresHeight;
    const maxHeight = 90; // Hauteur maximum du cadre (augmentée)
    const boxHeight = Math.min(totalHeight, maxHeight);
    
    // Cadre pour les détails
    yPos += 10;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(this.margin, yPos, this.pageWidth - 2 * this.margin, boxHeight);
    
    // Contenu du cadre
    let contentYPos = yPos + 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Formule : ${plan.name}`, this.margin + 5, contentYPos);
    
    contentYPos += 6;
    doc.setFont('helvetica', 'normal');
    
    // Affichage du prix avec remise si applicable
    if (contractData.discount && contractData.discount > 0) {
      const originalPrice = parseFloat(plan.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      const discountAmount = (originalPrice * contractData.discount) / 100;
      const finalPrice = originalPrice - discountAmount;
      
      doc.text(`Prix initial : ${plan.price}${plan.period ? ' ' + plan.period : ''}`, this.margin + 5, contentYPos);
      contentYPos += 5;
      doc.text(`Remise : -${contractData.discount}% (-${Math.round(discountAmount)}€)`, this.margin + 5, contentYPos);
      contentYPos += 5;
      doc.setFont('helvetica', 'bold');
      doc.text(`Prix final : ${Math.round(finalPrice)}€${plan.period ? ' ' + plan.period : ''}`, this.margin + 5, contentYPos);
      doc.setFont('helvetica', 'normal');
    } else {
      doc.text(`Prix : ${plan.price}${plan.period ? ' ' + plan.period : ''}`, this.margin + 5, contentYPos);
    }
    
    contentYPos += 6;
    // Gérer la description longue
    const descriptionLines = doc.splitTextToSize(`Description : ${plan.description}`, this.pageWidth - 2 * this.margin - 10);
    for (const line of descriptionLines) {
      doc.text(line, this.margin + 5, contentYPos);
      contentYPos += 4;
    }
    
    // Prestations incluses
    contentYPos += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Prestations incluses :', this.margin + 5, contentYPos);
    
    contentYPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const maxYInBox = yPos + boxHeight - 5;
    
    for (let i = 0; i < plan.features.length; i++) {
      const feature = plan.features[i];
      
      // Si on dépasse le cadre, on continue sur une nouvelle page
      if (contentYPos > maxYInBox) {
        doc.addPage();
        contentYPos = 30;
        
        // Titre pour la suite des prestations
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('PRESTATIONS INCLUSES (suite)', this.margin, contentYPos);
        contentYPos += 10;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
      }
      
      // Gérer les features longues
      const featureLines = doc.splitTextToSize(`• ${feature}`, this.pageWidth - 2 * this.margin - 15);
      for (const line of featureLines) {
        if (contentYPos > this.pageHeight - 40) {
          doc.addPage();
          contentYPos = 30;
        }
        doc.text(line, this.margin + 10, contentYPos);
        contentYPos += 4;
      }
    }
    
    return Math.max(yPos + boxHeight + 10, contentYPos + 10);
  }

  addTermsAndConditions(doc, startYPos, contractData) {
    let yPos = startYPos || 250;
    
    // Vérifier si on a assez de place, sinon nouvelle page
    if (yPos > this.pageHeight - 100) {
      doc.addPage();
      yPos = 30;
    }
    
    // Titre
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('CONDITIONS GÉNÉRALES', this.margin, yPos);
    
    yPos += 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    // Calculer le prix final pour les modalités de paiement
    let finalPrice = 0;
    if (contractData.plan.price !== 'Sur devis') {
      const originalPrice = parseFloat(contractData.plan.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      if (contractData.discount && contractData.discount > 0) {
        const discountAmount = (originalPrice * contractData.discount) / 100;
        finalPrice = originalPrice - discountAmount;
      } else {
        finalPrice = originalPrice;
      }
    }
    
    // Calculer les montants des échéances
    const payment30 = Math.round(finalPrice * 0.30);
    const payment40 = Math.round(finalPrice * 0.40);
    const payment30Final = Math.round(finalPrice) - payment30 - payment40; // Pour éviter les erreurs d'arrondi
    
    const terms = [
      '1. OBJET DU CONTRAT',
      'Le présent contrat a pour objet la création et le développement d\'un site web selon les spécifications définies dans la formule choisie.',
      '',
      '2. DÉLAIS DE RÉALISATION',
      'Les délais de réalisation seront convenus lors de la validation du cahier des charges et dépendront de la complexité du projet.',
      '',
      '3. MODALITÉS DE PAIEMENT',
      finalPrice > 0 ? `• 30% à la signature du contrat (${payment30}€ HT soit ${Math.round(payment30 * 1.2)}€ TTC)` : '• 30% à la signature du contrat',
      finalPrice > 0 ? `• 40% à la validation de la maquette (${payment40}€ HT soit ${Math.round(payment40 * 1.2)}€ TTC)` : '• 40% à la validation de la maquette',
      finalPrice > 0 ? `• 30% à la livraison finale (${payment30Final}€ HT soit ${Math.round(payment30Final * 1.2)}€ TTC)` : '• 30% à la livraison finale',
      '',
      '4. PROPRIÉTÉ INTELLECTUELLE',
      'Le client devient propriétaire du site web après paiement intégral. Le code source reste la propriété de JVNR sauf accord contraire.',
      '',
      '5. GARANTIE ET MAINTENANCE',
      'Une garantie de 3 mois est incluse pour corriger les éventuels dysfonctionnements. La maintenance préventive fait l\'objet d\'un contrat séparé.',
      '',
      '6. RESPONSABILITÉS',
      'JVNR s\'engage à livrer un site conforme aux spécifications. Le client s\'engage à fournir tous les éléments nécessaires dans les délais convenus.'
    ];
    
    for (const term of terms) {
      // Vérifier l'espace disponible avant d'ajouter du contenu
      if (yPos > this.pageHeight - 60) {
        doc.addPage();
        yPos = 30;
        
        // Répéter le titre sur la nouvelle page si nécessaire
        if (term.startsWith('4.') || term.startsWith('5.') || term.startsWith('6.')) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('CONDITIONS GÉNÉRALES (suite)', this.margin, yPos);
          yPos += 10;
          doc.setFontSize(9);
        }
      }
      
      if (term.startsWith('1.') || term.startsWith('2.') || term.startsWith('3.') ||
          term.startsWith('4.') || term.startsWith('5.') || term.startsWith('6.')) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      if (term === '') {
        yPos += 2;
        continue;
      }
      
      // Gérer les lignes longues
      const maxWidth = this.pageWidth - 2 * this.margin;
      const lines = doc.splitTextToSize(term, maxWidth);
      
      for (const line of lines) {
        if (yPos > this.pageHeight - 60) {
          doc.addPage();
          yPos = 30;
        }
        doc.text(line, this.margin, yPos);
        yPos += 3.5;
      }
      yPos += 1;
    }
    
    return yPos;
  }

  addSignatures(doc) {
    let yPos = this.pageHeight - 60;
    
    // Ligne de séparation
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(this.margin, yPos - 10, this.pageWidth - this.margin, yPos - 10);
    
    // Signatures
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Signature prestataire
    doc.text('Signature du prestataire :', this.margin, yPos);
    doc.text('JVNR', this.margin, yPos + 15);
    doc.text('Date : _______________', this.margin, yPos + 25);
    
    // Signature client
    const rightX = this.pageWidth / 2 + 10;
    doc.text('Signature du client :', rightX, yPos);
    doc.text('Nom : _______________', rightX, yPos + 15);
    doc.text('Date : _______________', rightX, yPos + 25);
  }

  addFooter(doc) {
    const footerY = this.pageHeight - 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    const footerText = 'JVNR - Créateur de solutions digitales | contact@jvnr.fr | https://jvnr.fr';
    const textWidth = doc.getTextWidth(footerText);
    const textX = (this.pageWidth - textWidth) / 2;
    
    doc.text(footerText, textX, footerY);
  }

  generateContract(contractData) {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Ajouter les sections
    this.addHeader(doc);
    this.addContractTitle(doc, contractData.plan.name);
    this.addContractInfo(doc, contractData);
    const nextYPos = this.addPlanDetails(doc, contractData);
    const termsEndPos = this.addTermsAndConditions(doc, nextYPos + 10, contractData);
    this.addSignatures(doc);
    this.addFooter(doc);
    
    return doc;
  }
}

// Générateur de contrats de maintenance
class MaintenanceContractPDFGenerator {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
  }

  addHeader(doc) {
    // Logo/Nom de l'entreprise
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('JVNR', this.margin, 30);
    
    // Sous-titre
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Créateur de solutions digitales', this.margin, 38);
    
    // Ligne de séparation
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(this.margin, 45, this.pageWidth - this.margin, 45);
  }

  addContractTitle(doc) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const title = 'CONTRAT DE MAINTENANCE';
    const titleWidth = doc.getTextWidth(title);
    const titleX = (this.pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 65);
  }

  addContractInfo(doc, contractData) {
    let yPos = 85;
    
    // Informations du contrat
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    
    // Colonne gauche - Prestataire
    doc.text('PRESTATAIRE :', this.margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('JVNR', this.margin, yPos);
    yPos += 5;
    doc.text('Créateur de solutions digitales', this.margin, yPos);
    yPos += 5;
    doc.text('SIRET : 53273637800029', this.margin, yPos);
    yPos += 5;
    doc.text('Email : contact@jvnr.fr', this.margin, yPos);
    yPos += 5;
    doc.text('Site web : https://jvnr.fr', this.margin, yPos);
    
    // Colonne droite - Client
    yPos = 85;
    const rightColumnX = this.pageWidth / 2 + 10;
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT :', rightColumnX, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(contractData.clientName, rightColumnX, yPos);
    yPos += 5;
    if (contractData.clientSiret) {
      doc.text(`SIRET : ${contractData.clientSiret}`, rightColumnX, yPos);
      yPos += 5;
    }
    doc.text(contractData.clientEmail, rightColumnX, yPos);
    yPos += 5;
    
    // Adresse client
    const addressLines = contractData.clientAddress.split('\n');
    for (const line of addressLines) {
      doc.text(line, rightColumnX, yPos);
      yPos += 5;
    }
    
    // Informations du contrat
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`N° de contrat : ${contractData.contractNumber}`, this.margin, yPos);
    yPos += 5;
    doc.text(`Date : ${contractData.contractDate}`, this.margin, yPos);
    yPos += 5;
    if (contractData.plan.websiteUrl) {
      doc.text(`Site concerné : ${contractData.plan.websiteUrl}`, this.margin, yPos);
    }
  }

  addMaintenanceDetails(doc, contractData) {
    const plan = contractData.plan;
    let yPos = 160;
    
    // Titre de la section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('DÉTAILS DE LA MAINTENANCE', this.margin, yPos);
    
    // Cadre pour les détails
    yPos += 10;
    const boxHeight = 80;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(this.margin, yPos, this.pageWidth - 2 * this.margin, boxHeight);
    
    // Contenu du cadre
    let contentYPos = yPos + 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Forfait : ${plan.name}`, this.margin + 5, contentYPos);
    
    contentYPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Prix : ${plan.price}${plan.period}`, this.margin + 5, contentYPos);
    
    contentYPos += 6;
    doc.text(`Durée : ${plan.duration} mois`, this.margin + 5, contentYPos);
    
    contentYPos += 6;
    const descriptionLines = doc.splitTextToSize(`Description : ${plan.description}`, this.pageWidth - 2 * this.margin - 10);
    for (const line of descriptionLines) {
      doc.text(line, this.margin + 5, contentYPos);
      contentYPos += 4;
    }
    
    // Prestations incluses
    contentYPos += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Prestations incluses :', this.margin + 5, contentYPos);
    
    contentYPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    for (const feature of plan.features) {
      const featureLines = doc.splitTextToSize(`• ${feature}`, this.pageWidth - 2 * this.margin - 15);
      for (const line of featureLines) {
        doc.text(line, this.margin + 10, contentYPos);
        contentYPos += 4;
      }
    }
    
    return yPos + boxHeight + 10;
  }

  addPaymentSchedule(doc, startYPos, contractData) {
    let yPos = startYPos;
    
    // Titre de la section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('ÉCHÉANCIER DE PAIEMENT', this.margin, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Calculer le prix
    let price = 0;
    if (contractData.plan.price !== 'Sur devis') {
      price = parseFloat(contractData.plan.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    }
    
    if (price > 0) {
      const duration = contractData.plan.duration || 12;
      const isOneTimePayment = contractData.plan.isOneTimePayment;
      const isPriceTTC = contractData.plan.isPriceTTC;
      
      // Calculer les prix HT et TTC selon le type de prix saisi
      let priceHT, priceTTC;
      if (isPriceTTC) {
        priceTTC = price;
        priceHT = Math.round(price / 1.2);
      } else {
        priceHT = price;
        priceTTC = Math.round(price * 1.2);
      }
      
      if (isOneTimePayment) {
        // Paiement en une fois
        doc.text('Paiement unique :', this.margin, yPos);
        yPos += 8;
        
        const paymentDate = new Date();
        paymentDate.setDate(paymentDate.getDate() + 30); // 30 jours après signature
        
        const formattedDate = paymentDate.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        doc.text(`• ${formattedDate} - Paiement intégral : ${Math.round(priceHT)}€ HT (${Math.round(priceTTC)}€ TTC)`, this.margin + 5, yPos);
        yPos += 8;
        
        doc.setFont('helvetica', 'bold');
        doc.text(`Montant total : ${Math.round(priceHT)}€ HT (${Math.round(priceTTC)}€ TTC) pour ${duration} mois`, this.margin, yPos);
        
      } else {
        // Paiement mensuel (comportement existant)
        const startDate = new Date();
        
        doc.text('Échéances mensuelles :', this.margin, yPos);
        yPos += 8;
        
        for (let i = 0; i < Math.min(duration, 12); i++) { // Afficher max 12 mois pour éviter débordement
          const paymentDate = new Date(startDate);
          paymentDate.setMonth(paymentDate.getMonth() + i + 1);
          paymentDate.setDate(1); // Premier du mois
          
          const formattedDate = paymentDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          
          const monthName = paymentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
          
          // Vérifier l'espace disponible
          if (yPos > this.pageHeight - 40) {
            doc.addPage();
            yPos = 30;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('ÉCHÉANCIER DE PAIEMENT (suite)', this.margin, yPos);
            yPos += 15;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
          }
          
          doc.text(`• ${formattedDate} - ${monthName} : ${Math.round(priceHT)}€ HT (${Math.round(priceTTC)}€ TTC)`, this.margin + 5, yPos);
          yPos += 5;
        }
        
        if (duration > 12) {
          yPos += 3;
          doc.setFont('helvetica', 'italic');
          doc.text(`... et ainsi de suite pour les ${duration - 12} mois restants`, this.margin + 5, yPos);
          yPos += 5;
          doc.setFont('helvetica', 'normal');
        }
        
        yPos += 8;
        doc.setFont('helvetica', 'bold');
        const totalHT = Math.round(priceHT * duration);
        const totalTTC = Math.round(priceTTC * duration);
        doc.text(`Total sur ${duration} mois : ${totalHT}€ HT (${totalTTC}€ TTC)`, this.margin, yPos);
      }
      
    } else {
      doc.text('Échéancier à définir selon devis personnalisé', this.margin, yPos);
      yPos += 5;
    }
    
    return yPos + 15;
  }

  addMaintenanceTerms(doc, startYPos, contractData) {
    let yPos = startYPos || 250;
    
    // Vérifier si on a assez de place, sinon nouvelle page
    if (yPos > this.pageHeight - 120) {
      doc.addPage();
      yPos = 30;
    }
    
    // Titre
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('CONDITIONS DE MAINTENANCE', this.margin, yPos);
    
    yPos += 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const terms = [
      '1. OBJET DU CONTRAT',
      'Le présent contrat a pour objet la maintenance préventive et corrective du site web du client selon les modalités définies ci-dessous.',
      '',
      '2. DURÉE DU CONTRAT',
      `Le contrat est conclu pour une durée ferme de ${contractData.plan.duration} mois à compter de la signature. À l'échéance, le contrat prend fin automatiquement sans reconduction.`,
      '',
      '3. PRESTATIONS INCLUSES',
      '• Mises à jour de sécurité régulières',
      '• Sauvegardes automatiques quotidiennes',
      '• Monitoring de performance et disponibilité',
      '• Support technique prioritaire (réponse sous 24h)',
      '• Corrections de bugs et dysfonctionnements',
      '• Modifications mineures de contenu (2h/mois incluses)',
      '',
      '4. MODALITÉS DE PAIEMENT',
      contractData.plan.isOneTimePayment
        ? `Le tarif de la maintenance est de ${contractData.plan.price}${contractData.plan.period}. Le paiement s'effectue en une seule fois dans les 30 jours suivant la signature du contrat.`
        : `Le tarif de la maintenance est de ${contractData.plan.price}${contractData.plan.period}. Le paiement s'effectue mensuellement par prélèvement automatique ou virement, le 1er de chaque mois selon l'échéancier défini.`,
      '',
      '5. OBLIGATIONS DU CLIENT',
      'Le client s\'engage à fournir les accès nécessaires et à signaler rapidement tout dysfonctionnement. Il reste responsable du contenu publié sur son site.',
      '',
      '6. RESPONSABILITÉS ET GARANTIES',
      'JVNR s\'engage à maintenir le site en état de fonctionnement optimal. La garantie de disponibilité est de 99,5% hors maintenance programmée.',
      '',
      '7. RÉSILIATION ANTICIPÉE',
      'Chaque partie peut résilier le contrat de manière anticipée avec un préavis de 2 mois. En cas de non-paiement, JVNR peut suspendre les services après mise en demeure restée sans effet pendant 15 jours.'
    ];
    
    for (const term of terms) {
      // Vérifier l'espace disponible avant d'ajouter du contenu
      if (yPos > this.pageHeight - 60) {
        doc.addPage();
        yPos = 30;
        
        // Répéter le titre sur la nouvelle page si nécessaire
        if (term.startsWith('4.') || term.startsWith('5.') || term.startsWith('6.') || term.startsWith('7.')) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('CONDITIONS DE MAINTENANCE (suite)', this.margin, yPos);
          yPos += 10;
          doc.setFontSize(9);
        }
      }
      
      if (term.startsWith('1.') || term.startsWith('2.') || term.startsWith('3.') ||
          term.startsWith('4.') || term.startsWith('5.') || term.startsWith('6.') || term.startsWith('7.')) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      if (term === '') {
        yPos += 2;
        continue;
      }
      
      // Gérer les lignes longues
      const maxWidth = this.pageWidth - 2 * this.margin;
      const lines = doc.splitTextToSize(term, maxWidth);
      
      for (const line of lines) {
        if (yPos > this.pageHeight - 60) {
          doc.addPage();
          yPos = 30;
        }
        doc.text(line, this.margin, yPos);
        yPos += 3.5;
      }
      yPos += 1;
    }
    
    return yPos;
  }

  addSignatures(doc) {
    let yPos = this.pageHeight - 60;
    
    // Ligne de séparation
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(this.margin, yPos - 10, this.pageWidth - this.margin, yPos - 10);
    
    // Signatures
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    // Signature prestataire
    doc.text('Signature du prestataire :', this.margin, yPos);
    doc.text('JVNR', this.margin, yPos + 15);
    doc.text('Date : _______________', this.margin, yPos + 25);
    
    // Signature client
    const rightX = this.pageWidth / 2 + 10;
    doc.text('Signature du client :', rightX, yPos);
    doc.text('Nom : _______________', rightX, yPos + 15);
    doc.text('Date : _______________', rightX, yPos + 25);
  }

  addFooter(doc) {
    const footerY = this.pageHeight - 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    const footerText = 'JVNR - Créateur de solutions digitales | contact@jvnr.fr | https://jvnr.fr';
    const textWidth = doc.getTextWidth(footerText);
    const textX = (this.pageWidth - textWidth) / 2;
    
    doc.text(footerText, textX, footerY);
  }

  generateContract(contractData) {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Ajouter les sections
    this.addHeader(doc);
    this.addContractTitle(doc);
    this.addContractInfo(doc, contractData);
    const nextYPos = this.addMaintenanceDetails(doc, contractData);
    const termsEndPos = this.addMaintenanceTerms(doc, nextYPos + 10, contractData);
    this.addSignatures(doc);
    this.addFooter(doc);
    
    return doc;
  }
}

// Générateur de factures de maintenance
class MaintenanceInvoicePDFGenerator {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
  }

  addHeader(doc) {
    // Logo/Nom de l'entreprise
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('JVNR', this.margin, 30);
    
    // Sous-titre
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Créateur de solutions digitales', this.margin, 38);
    
    // Ligne de séparation
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(this.margin, 45, this.pageWidth - this.margin, 45);
  }

  addInvoiceTitle(doc, invoiceNumber) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const title = `FACTURE MAINTENANCE N° ${invoiceNumber}`;
    const titleWidth = doc.getTextWidth(title);
    const titleX = (this.pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 65);
  }

  addInvoiceInfo(doc, contractData, invoiceNumber) {
    let yPos = 85;
    
    // Informations de la facture
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    
    // Colonne gauche - Prestataire
    doc.text('PRESTATAIRE :', this.margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('JVNR', this.margin, yPos);
    yPos += 5;
    doc.text('Créateur de solutions digitales', this.margin, yPos);
    yPos += 5;
    doc.text('SIRET : 53273637800029', this.margin, yPos);
    yPos += 5;
    doc.text('Email : contact@jvnr.fr', this.margin, yPos);
    yPos += 5;
    doc.text('Site web : https://jvnr.fr', this.margin, yPos);
    
    // Colonne droite - Client
    yPos = 85;
    const rightColumnX = this.pageWidth / 2 + 10;
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT :', rightColumnX, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(contractData.clientName, rightColumnX, yPos);
    yPos += 5;
    if (contractData.clientSiret) {
      doc.text(`SIRET : ${contractData.clientSiret}`, rightColumnX, yPos);
      yPos += 5;
    }
    doc.text(contractData.clientEmail, rightColumnX, yPos);
    yPos += 5;
    
    // Adresse client
    const addressLines = contractData.clientAddress.split('\n');
    for (const line of addressLines) {
      doc.text(line, rightColumnX, yPos);
      yPos += 5;
    }
    
    // Informations de la facture
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`N° de facture : ${invoiceNumber}`, this.margin, yPos);
    yPos += 5;
    doc.text(`Date : ${contractData.contractDate}`, this.margin, yPos);
    yPos += 5;
    doc.text(`Contrat associé : ${contractData.contractNumber}`, this.margin, yPos);
    if (contractData.plan.websiteUrl) {
      yPos += 5;
      doc.text(`Site concerné : ${contractData.plan.websiteUrl}`, this.margin, yPos);
    }
  }

  addInvoiceDetails(doc, contractData) {
    let yPos = 180;
    
    // Calculer le prix final
    let finalPrice = 0;
    if (contractData.plan.price !== 'Sur devis') {
      finalPrice = parseFloat(contractData.plan.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    }
    
    // Calculer les prix HT et TTC selon le type de prix saisi
    let priceHT, priceTTC;
    if (finalPrice > 0) {
      const isPriceTTC = contractData.plan.isPriceTTC;
      if (isPriceTTC) {
        priceTTC = finalPrice;
        priceHT = Math.round(finalPrice / 1.2);
      } else {
        priceHT = finalPrice;
        priceTTC = Math.round(finalPrice * 1.2);
      }
    }
    
    // Titre
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('DÉTAIL DE LA FACTURATION MAINTENANCE', this.margin, yPos);
    
    // Tableau
    yPos += 15;
    const tableStartY = yPos;
    const rowHeight = 8;
    const colWidths = [80, 30, 30, 30]; // Description, Quantité, Prix unitaire, Total
    const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
    
    // En-têtes du tableau
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(this.margin, yPos, tableWidth, rowHeight);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', this.margin + 2, yPos + 5);
    doc.text('Qté', this.margin + colWidths[0] + 2, yPos + 5);
    doc.text('Prix unitaire HT', this.margin + colWidths[0] + colWidths[1] + 2, yPos + 5);
    doc.text('Total HT', this.margin + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos + 5);
    
    // Lignes verticales des en-têtes
    let xPos = this.margin + colWidths[0];
    for (let i = 1; i < colWidths.length; i++) {
      doc.line(xPos, yPos, xPos, yPos + rowHeight);
      xPos += colWidths[i];
    }
    
    // Ligne de données
    yPos += rowHeight;
    doc.rect(this.margin, yPos, tableWidth, rowHeight);
    
    doc.setFont('helvetica', 'normal');
    const description = `Maintenance ${contractData.plan.name}`;
    doc.text(description, this.margin + 2, yPos + 5);
    doc.text('1', this.margin + colWidths[0] + 2, yPos + 5);
    
    if (finalPrice > 0) {
      doc.text(`${Math.round(priceHT)}€`, this.margin + colWidths[0] + colWidths[1] + 2, yPos + 5);
      doc.text(`${Math.round(priceHT)}€`, this.margin + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos + 5);
    } else {
      doc.text('Sur devis', this.margin + colWidths[0] + colWidths[1] + 2, yPos + 5);
      doc.text('Sur devis', this.margin + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos + 5);
    }
    
    // Lignes verticales des données
    xPos = this.margin + colWidths[0];
    for (let i = 1; i < colWidths.length; i++) {
      doc.line(xPos, yPos, xPos, yPos + rowHeight);
      xPos += colWidths[i];
    }
    
    // Totaux
    if (finalPrice > 0) {
      yPos += rowHeight + 10;
      const totalX = this.margin + tableWidth - 60;
      
      doc.setFont('helvetica', 'bold');
      doc.text('Total HT :', totalX, yPos);
      doc.text(`${Math.round(priceHT)}€`, totalX + 30, yPos);
      
      yPos += 6;
      const tva = Math.round(priceTTC - priceHT);
      doc.text('TVA 20% :', totalX, yPos);
      doc.text(`${tva}€`, totalX + 30, yPos);
      
      yPos += 6;
      doc.setFontSize(12);
      doc.text('Total TTC :', totalX, yPos);
      doc.text(`${Math.round(priceTTC)}€`, totalX + 30, yPos);
    }
    
    return yPos + 20;
  }

  addPaymentSchedule(doc, startYPos, contractData) {
    let yPos = startYPos;
    
    // Titre de la section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('ÉCHÉANCIER DE PAIEMENT', this.margin, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Calculer le prix
    let price = 0;
    if (contractData.plan.price !== 'Sur devis') {
      price = parseFloat(contractData.plan.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    }
    
    if (price > 0) {
      const duration = contractData.plan.duration || 12;
      const isOneTimePayment = contractData.plan.isOneTimePayment;
      const isPriceTTC = contractData.plan.isPriceTTC;
      
      // Calculer les prix HT et TTC selon le type de prix saisi
      let priceHT, priceTTC;
      if (isPriceTTC) {
        priceTTC = price;
        priceHT = Math.round(price / 1.2);
      } else {
        priceHT = price;
        priceTTC = Math.round(price * 1.2);
      }
      
      if (isOneTimePayment) {
        // Paiement en une fois
        doc.text('Paiement unique :', this.margin, yPos);
        yPos += 8;
        
        const paymentDate = new Date();
        paymentDate.setDate(paymentDate.getDate() + 30); // 30 jours après facturation
        
        const formattedDate = paymentDate.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        doc.text(`• ${formattedDate} - Paiement intégral : ${Math.round(priceHT)}€ HT (${Math.round(priceTTC)}€ TTC)`, this.margin + 5, yPos);
        yPos += 8;
        
        doc.setFont('helvetica', 'bold');
        doc.text(`Montant total : ${Math.round(priceHT)}€ HT (${Math.round(priceTTC)}€ TTC) pour ${duration} mois`, this.margin, yPos);
        
      } else {
        // Paiement mensuel (comportement existant)
        const startDate = new Date();
        
        doc.text('Échéances mensuelles :', this.margin, yPos);
        yPos += 8;
        
        for (let i = 0; i < Math.min(duration, 12); i++) { // Afficher max 12 mois pour éviter débordement
          const paymentDate = new Date(startDate);
          paymentDate.setMonth(paymentDate.getMonth() + i + 1);
          paymentDate.setDate(1); // Premier du mois
          
          const formattedDate = paymentDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          
          const monthName = paymentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
          
          // Vérifier l'espace disponible
          if (yPos > this.pageHeight - 40) {
            doc.addPage();
            yPos = 30;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('ÉCHÉANCIER DE PAIEMENT (suite)', this.margin, yPos);
            yPos += 15;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
          }
          
          doc.text(`• ${formattedDate} - ${monthName} : ${Math.round(priceHT)}€ HT (${Math.round(priceTTC)}€ TTC)`, this.margin + 5, yPos);
          yPos += 5;
        }
        
        if (duration > 12) {
          yPos += 3;
          doc.setFont('helvetica', 'italic');
          doc.text(`... et ainsi de suite pour les ${duration - 12} mois restants`, this.margin + 5, yPos);
          yPos += 5;
          doc.setFont('helvetica', 'normal');
        }
        
        yPos += 8;
        doc.setFont('helvetica', 'bold');
        const totalHT = Math.round(priceHT * duration);
        const totalTTC = Math.round(priceTTC * duration);
        doc.text(`Total sur ${duration} mois : ${totalHT}€ HT (${totalTTC}€ TTC)`, this.margin, yPos);
      }
      
    } else {
      doc.text('Échéancier à définir selon devis personnalisé', this.margin, yPos);
      yPos += 5;
    }
    
    return yPos + 15;
  }

  addPaymentTerms(doc, startYPos, contractData) {
    let yPos = startYPos;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('MODALITÉS DE PAIEMENT', this.margin, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (contractData.plan.isOneTimePayment) {
      doc.text('• Paiement unique dans les 30 jours suivant la facturation', this.margin, yPos);
      yPos += 5;
      doc.text('• Virement bancaire ou chèque', this.margin, yPos);
    } else {
      doc.text('• Paiement mensuel par prélèvement automatique ou virement', this.margin, yPos);
      yPos += 5;
      doc.text('• Échéance le 1er de chaque mois', this.margin, yPos);
    }
    
    return yPos + 15;
  }

  addFooter(doc) {
    const footerY = this.pageHeight - 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    const footerText = 'JVNR - Créateur de solutions digitales | contact@jvnr.fr | https://jvnr.fr';
    const textWidth = doc.getTextWidth(footerText);
    const textX = (this.pageWidth - textWidth) / 2;
    
    doc.text(footerText, textX, footerY);
  }

  generateInvoice(contractData, invoiceNumber) {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Ajouter les sections
    this.addHeader(doc);
    this.addInvoiceTitle(doc, invoiceNumber);
    this.addInvoiceInfo(doc, contractData, invoiceNumber);
    const nextYPos = this.addInvoiceDetails(doc, contractData);
    const scheduleEndPos = this.addPaymentSchedule(doc, nextYPos + 10, contractData);
    this.addPaymentTerms(doc, scheduleEndPos + 10, contractData);
    this.addFooter(doc);
    
    return doc;
  }
}

// Fonction utilitaire pour générer un numéro de contrat
function generateContractNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `JVNR-${year}${month}${day}-${random}`;
}

// Fonction utilitaire pour formater la date
function formatDate(date) {
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Générateur de factures
class InvoicePDFGenerator {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
  }

  addHeader(doc) {
    // Logo/Nom de l'entreprise
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('JVNR', this.margin, 30);
    
    // Sous-titre
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Créateur de solutions digitales', this.margin, 38);
    
    // Ligne de séparation
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(this.margin, 45, this.pageWidth - this.margin, 45);
  }

  addInvoiceTitle(doc, invoiceNumber) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const title = `FACTURE N° ${invoiceNumber}`;
    const titleWidth = doc.getTextWidth(title);
    const titleX = (this.pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 65);
  }

  addInvoiceInfo(doc, contractData, invoiceNumber) {
    let yPos = 85;
    
    // Informations de la facture
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    
    // Colonne gauche - Prestataire
    doc.text('PRESTATAIRE :', this.margin, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('JVNR', this.margin, yPos);
    yPos += 5;
    doc.text('Créateur de solutions digitales', this.margin, yPos);
    yPos += 5;
    doc.text('SIRET : 53273637800029', this.margin, yPos);
    yPos += 5;
    doc.text('Email : contact@jvnr.fr', this.margin, yPos);
    yPos += 5;
    doc.text('Site web : https://jvnr.fr', this.margin, yPos);
    
    // Colonne droite - Client
    yPos = 85;
    const rightColumnX = this.pageWidth / 2 + 10;
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT :', rightColumnX, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(contractData.clientName, rightColumnX, yPos);
    yPos += 5;
    if (contractData.clientSiret) {
      doc.text(`SIRET : ${contractData.clientSiret}`, rightColumnX, yPos);
      yPos += 5;
    }
    doc.text(contractData.clientEmail, rightColumnX, yPos);
    yPos += 5;
    
    // Adresse client
    const addressLines = contractData.clientAddress.split('\n');
    for (const line of addressLines) {
      doc.text(line, rightColumnX, yPos);
      yPos += 5;
    }
    
    // Informations de la facture
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`N° de facture : ${invoiceNumber}`, this.margin, yPos);
    yPos += 5;
    doc.text(`Date : ${contractData.contractDate}`, this.margin, yPos);
    yPos += 5;
    doc.text(`Contrat associé : ${contractData.contractNumber}`, this.margin, yPos);
  }

  addInvoiceDetails(doc, contractData) {
    let yPos = 170;
    
    // Calculer le prix final
    let finalPrice = 0;
    if (contractData.plan.price !== 'Sur devis') {
      const originalPrice = parseFloat(contractData.plan.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      if (contractData.discount && contractData.discount > 0) {
        const discountAmount = (originalPrice * contractData.discount) / 100;
        finalPrice = originalPrice - discountAmount;
      } else {
        finalPrice = originalPrice;
      }
    }
    
    // Titre
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('DÉTAIL DE LA FACTURATION', this.margin, yPos);
    
    // Tableau
    yPos += 15;
    const tableStartY = yPos;
    const rowHeight = 8;
    const colWidths = [80, 30, 30, 30]; // Description, Quantité, Prix unitaire, Total
    const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
    
    // En-têtes du tableau
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(this.margin, yPos, tableWidth, rowHeight);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', this.margin + 2, yPos + 5);
    doc.text('Qté', this.margin + colWidths[0] + 2, yPos + 5);
    doc.text('Prix unitaire HT', this.margin + colWidths[0] + colWidths[1] + 2, yPos + 5);
    doc.text('Total HT', this.margin + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos + 5);
    
    // Lignes verticales des en-têtes
    let xPos = this.margin + colWidths[0];
    for (let i = 1; i < colWidths.length; i++) {
      doc.line(xPos, yPos, xPos, yPos + rowHeight);
      xPos += colWidths[i];
    }
    
    // Ligne de données
    yPos += rowHeight;
    doc.rect(this.margin, yPos, tableWidth, rowHeight);
    
    doc.setFont('helvetica', 'normal');
    const description = `${contractData.plan.name}${contractData.discount ? ` (remise ${contractData.discount}%)` : ''}`;
    doc.text(description, this.margin + 2, yPos + 5);
    doc.text('1', this.margin + colWidths[0] + 2, yPos + 5);
    
    if (finalPrice > 0) {
      doc.text(`${Math.round(finalPrice)}€`, this.margin + colWidths[0] + colWidths[1] + 2, yPos + 5);
      doc.text(`${Math.round(finalPrice)}€`, this.margin + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos + 5);
    } else {
      doc.text('Sur devis', this.margin + colWidths[0] + colWidths[1] + 2, yPos + 5);
      doc.text('Sur devis', this.margin + colWidths[0] + colWidths[1] + colWidths[2] + 2, yPos + 5);
    }
    
    // Lignes verticales des données
    xPos = this.margin + colWidths[0];
    for (let i = 1; i < colWidths.length; i++) {
      doc.line(xPos, yPos, xPos, yPos + rowHeight);
      xPos += colWidths[i];
    }
    
    // Totaux
    if (finalPrice > 0) {
      yPos += rowHeight + 10;
      const totalX = this.margin + tableWidth - 60;
      
      doc.setFont('helvetica', 'bold');
      doc.text('Total HT :', totalX, yPos);
      doc.text(`${Math.round(finalPrice)}€`, totalX + 30, yPos);
      
      yPos += 6;
      const tva = Math.round(finalPrice * 0.20);
      doc.text('TVA 20% :', totalX, yPos);
      doc.text(`${tva}€`, totalX + 30, yPos);
      
      yPos += 6;
      const totalTTC = Math.round(finalPrice) + tva;
      doc.setFontSize(12);
      doc.text('Total TTC :', totalX, yPos);
      doc.text(`${totalTTC}€`, totalX + 30, yPos);
    }
    
    return yPos + 20;
  }

  addPaymentTerms(doc, startYPos, contractData) {
    let yPos = startYPos;
    
    // Calculer le prix final pour les échéances
    let finalPrice = 0;
    if (contractData.plan.price !== 'Sur devis') {
      const originalPrice = parseFloat(contractData.plan.price.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      if (contractData.discount && contractData.discount > 0) {
        const discountAmount = (originalPrice * contractData.discount) / 100;
        finalPrice = originalPrice - discountAmount;
      } else {
        finalPrice = originalPrice;
      }
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('MODALITÉS DE PAIEMENT', this.margin, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (finalPrice > 0) {
      const payment30 = Math.round(finalPrice * 0.30);
      const payment40 = Math.round(finalPrice * 0.40);
      const payment30Final = Math.round(finalPrice) - payment30 - payment40;
      
      doc.text(`• 30% à la signature du contrat (${payment30}€ HT soit ${Math.round(payment30 * 1.2)}€ TTC)`, this.margin, yPos);
      yPos += 5;
      doc.text(`• 40% à la validation de la maquette (${payment40}€ HT soit ${Math.round(payment40 * 1.2)}€ TTC)`, this.margin, yPos);
      yPos += 5;
      doc.text(`• 30% à la livraison finale (${payment30Final}€ HT soit ${Math.round(payment30Final * 1.2)}€ TTC)`, this.margin, yPos);
    } else {
      doc.text('• Modalités de paiement à définir selon devis', this.margin, yPos);
    }
    
    return yPos + 15;
  }

  addFooter(doc) {
    const footerY = this.pageHeight - 15;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    const footerText = 'JVNR - Créateur de solutions digitales | contact@jvnr.fr | https://jvnr.fr';
    const textWidth = doc.getTextWidth(footerText);
    const textX = (this.pageWidth - textWidth) / 2;
    
    doc.text(footerText, textX, footerY);
  }

  generateInvoice(contractData, invoiceNumber) {
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Ajouter les sections
    this.addHeader(doc);
    this.addInvoiceTitle(doc, invoiceNumber);
    this.addInvoiceInfo(doc, contractData, invoiceNumber);
    const nextYPos = this.addInvoiceDetails(doc, contractData);
    this.addPaymentTerms(doc, nextYPos, contractData);
    this.addFooter(doc);
    
    return doc;
  }
}
// Générateur de contrat de maintenance
async function generateMaintenanceContract() {
  console.log('\n🔧 === GÉNÉRATEUR DE CONTRAT DE MAINTENANCE ===\n');
  
  try {
    // Afficher les détails de la maintenance
    console.log('📋 Forfait Maintenance :');
    console.log(`${pricingData.maintenance.name} - ${pricingData.maintenance.price}${pricingData.maintenance.period}`);
    console.log(`${pricingData.maintenance.description}\n`);
    
    // Mode de paiement de la maintenance
    console.log('💰 Mode de paiement :');
    console.log('1. Paiement mensuel');
    console.log('2. Paiement en une fois');
    
    const paymentModeChoice = await askQuestion('Choisissez le mode de paiement (1 ou 2) : ');
    const isOneTimePayment = paymentModeChoice === '2';
    
    // Choix HT ou TTC
    console.log('\n💰 Type de prix :');
    console.log('1. Prix HT (Hors Taxes)');
    console.log('2. Prix TTC (Toutes Taxes Comprises)');
    
    const priceTypeChoice = await askQuestion('Le prix saisi sera-t-il HT ou TTC ? (1 ou 2) : ');
    const isPriceTTC = priceTypeChoice === '2';
    
    let maintenancePrice = 'Sur devis';
    let contractDuration = 12;
    
    if (isOneTimePayment) {
      // Paiement en une fois
      console.log('\n💳 Paiement en une fois sélectionné');
      
      // Durée du contrat
      const duration = await askQuestion('Durée du contrat de maintenance (en mois, ex: 12) : ');
      if (duration && !isNaN(duration)) {
        contractDuration = parseInt(duration);
      }
      
      // Prix total pour la durée complète
      const totalPrice = await askQuestion(`Prix total pour ${contractDuration} mois de maintenance (en euros, sans €, ${isPriceTTC ? 'TTC' : 'HT'}) : `);
      if (totalPrice && !isNaN(totalPrice)) {
        maintenancePrice = `${parseInt(totalPrice)}€`;
      }
    } else {
      // Paiement mensuel (comportement existant)
      console.log('\n📅 Paiement mensuel sélectionné');
      
      // Prix mensuel pour la maintenance
      const customPrice = await askQuestion(`Prix mensuel de la maintenance (en euros, sans €, ${isPriceTTC ? 'TTC' : 'HT'}) : `);
      if (customPrice && !isNaN(customPrice)) {
        maintenancePrice = `${parseInt(customPrice)}€`;
      }
      
      // Durée du contrat
      const duration = await askQuestion('Durée du contrat de maintenance (en mois, ex: 12) : ');
      if (duration && !isNaN(duration)) {
        contractDuration = parseInt(duration);
      }
    }
    
    // Personnalisation des prestations de maintenance
    console.log('\n🛠️ Personnalisation des prestations de maintenance :');
    console.log('Prestations par défaut :');
    pricingData.maintenance.features.forEach((feature, index) => {
      console.log(`${index + 1}. ${feature}`);
    });
    
    let customFeatures = [...pricingData.maintenance.features];
    
    const modifyFeatures = await askQuestion('\nSouhaitez-vous modifier les prestations ? (o/N) : ');
    if (modifyFeatures.toLowerCase() === 'o' || modifyFeatures.toLowerCase() === 'oui') {
      
      // Supprimer des prestations
      const removeFeatures = await askQuestion('Souhaitez-vous supprimer des prestations ? (o/N) : ');
      if (removeFeatures.toLowerCase() === 'o' || removeFeatures.toLowerCase() === 'oui') {
        console.log('\nPrestations actuelles :');
        customFeatures.forEach((feature, index) => {
          console.log(`${index + 1}. ${feature}`);
        });
        
        const toRemove = await askQuestion('Numéros des prestations à supprimer (séparés par des virgules, ex: 1,3) : ');
        if (toRemove.trim()) {
          const indices = toRemove.split(',').map(n => parseInt(n.trim()) - 1).filter(i => i >= 0 && i < customFeatures.length);
          // Supprimer en ordre décroissant pour éviter les problèmes d'index
          indices.sort((a, b) => b - a).forEach(index => {
            customFeatures.splice(index, 1);
          });
          console.log(`✅ ${indices.length} prestation(s) supprimée(s)`);
        }
      }
      
      // Ajouter des prestations
      const addFeatures = await askQuestion('Souhaitez-vous ajouter des prestations ? (o/N) : ');
      if (addFeatures.toLowerCase() === 'o' || addFeatures.toLowerCase() === 'oui') {
        console.log('\nAjout de nouvelles prestations (appuyez sur Entrée après chaque prestation, ligne vide pour terminer) :');
        let newFeature;
        do {
          newFeature = await askQuestion('> ');
          if (newFeature.trim()) {
            customFeatures.push(newFeature.trim());
            console.log(`✅ Ajouté : ${newFeature.trim()}`);
          }
        } while (newFeature.trim());
      }
    }
    
    // Informations du client
    console.log('\n👤 Informations du client :');
    const clientName = await askQuestion('Nom du client (ou raison sociale) : ');
    const clientSiret = await askQuestion('SIRET du client (optionnel) : ');
    const clientEmail = await askQuestion('Email du client : ');
    
    console.log('\n📍 Adresse du client (appuyez sur Entrée après chaque ligne, ligne vide pour terminer) :');
    let addressLines = [];
    let addressLine;
    do {
      addressLine = await askQuestion('> ');
      if (addressLine.trim()) {
        addressLines.push(addressLine.trim());
      }
    } while (addressLine.trim());
    
    const clientAddress = addressLines.join('\n');
    
    // Site web concerné (optionnel)
    const websiteUrl = await askQuestion('URL du site web concerné (optionnel) : ');
    
    // Validation des données
    if (!clientName || !clientEmail || !clientAddress) {
      console.log('❌ Toutes les informations sont obligatoires. Arrêt du script.');
      rl.close();
      return;
    }
    
    // Créer un plan de maintenance personnalisé
    const maintenancePlan = {
      ...pricingData.maintenance,
      features: customFeatures,
      price: maintenancePrice,
      period: isOneTimePayment
        ? ` ${isPriceTTC ? 'TTC' : 'HT'} (paiement unique)`
        : `/mois ${isPriceTTC ? 'TTC' : 'HT'}`,
      type: 'maintenance',
      duration: contractDuration,
      websiteUrl: websiteUrl || null,
      isOneTimePayment: isOneTimePayment,
      isPriceTTC: isPriceTTC
    };
    
    // Génération du contrat
    console.log('\n🔄 Génération du contrat de maintenance en cours...');
    
    const contractData = {
      plan: maintenancePlan,
      clientName,
      clientSiret: clientSiret.trim() || null,
      clientEmail,
      clientAddress,
      contractDate: formatDate(new Date()),
      contractNumber: generateContractNumber(),
      discount: null,
      isMaintenanceContract: true
    };
    
    const generator = new MaintenanceContractPDFGenerator();
    const doc = generator.generateContract(contractData);
    
    // Sauvegarde
    const outputDir = path.join(process.cwd(), 'contracts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filename = `contrat-maintenance-${contractData.contractNumber}.pdf`;
    const filepath = path.join(outputDir, filename);
    
    doc.save(filepath);
    
    console.log('\n🎉 Contrat de maintenance généré avec succès !');
    console.log(`📄 Fichier : ${filepath}`);
    console.log(`📋 N° de contrat : ${contractData.contractNumber}`);
    console.log(`👤 Client : ${clientName}`);
    if (clientSiret.trim()) {
      console.log(`🏢 SIRET client : ${clientSiret}`);
    }
    console.log(`🔧 Maintenance : ${maintenancePrice} ${isPriceTTC ? 'TTC' : 'HT'}${isOneTimePayment ? ' (paiement unique)' : '/mois'} pour ${contractDuration} mois`);
    console.log(`📋 Prestations personnalisées : ${customFeatures.length} prestation(s)`);
    if (websiteUrl) {
      console.log(`🌐 Site concerné : ${websiteUrl}`);
    }
    
    // Proposer de générer une facture
    const invoiceChoice = await askQuestion('\n📄 Souhaitez-vous générer une facture correspondante ? (o/N) : ');
    if (invoiceChoice.toLowerCase() === 'o' || invoiceChoice.toLowerCase() === 'oui') {
      await generateMaintenanceInvoice(contractData);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du contrat de maintenance :', error.message);
  }
}

// Générateur de facture de maintenance
async function generateMaintenanceInvoice(contractData) {
  try {
    console.log('\n📄 Génération de la facture de maintenance...');
    
    const invoiceNumber = `FAC-MAINT-${contractData.contractNumber.replace('JVNR-', '')}`;
    const generator = new MaintenanceInvoicePDFGenerator();
    const doc = generator.generateInvoice(contractData, invoiceNumber);
    
    // Sauvegarde
    const outputDir = path.join(process.cwd(), 'contracts');
    const filename = `facture-maintenance-${invoiceNumber}.pdf`;
    const filepath = path.join(outputDir, filename);
    
    doc.save(filepath);
    
    console.log('✅ Facture de maintenance générée avec succès !');
    console.log(`📄 Fichier : ${filepath}`);
    console.log(`📋 N° de facture : ${invoiceNumber}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération de la facture de maintenance :', error.message);
  }
}

async function generateInvoice(contractData) {
  try {
    console.log('\n📄 Génération de la facture...');
    
    const invoiceNumber = `FAC-${contractData.contractNumber.replace('JVNR-', '')}`;
    const generator = new InvoicePDFGenerator();
    const doc = generator.generateInvoice(contractData, invoiceNumber);
    
    // Sauvegarde
    const outputDir = path.join(process.cwd(), 'contracts');
    const filename = `facture-${contractData.plan.type}-${invoiceNumber}.pdf`;
    const filepath = path.join(outputDir, filename);
    
    doc.save(filepath);
    
    console.log('✅ Facture générée avec succès !');
    console.log(`📄 Fichier : ${filepath}`);
    console.log(`📋 N° de facture : ${invoiceNumber}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération de la facture :', error.message);
  }
}

// Interface readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function generateInteractiveContract() {
  console.log('\n🎯 === GÉNÉRATEUR DE CONTRAT JVNR ===\n');
  
  try {
    // Afficher les options disponibles
    console.log('📋 Options disponibles :');
    console.log('=== SITES WEB ===');
    pricingData.plans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name} - ${plan.price}${plan.period ? ' ' + plan.period : ''}`);
      console.log(`   ${plan.description}\n`);
    });
    
    console.log('=== MAINTENANCE ===');
    console.log(`${pricingData.plans.length + 1}. ${pricingData.maintenance.name} - ${pricingData.maintenance.price}${pricingData.maintenance.period}`);
    console.log(`   ${pricingData.maintenance.description}\n`);
    
    // Sélection du plan
    const totalOptions = pricingData.plans.length + 1;
    const planChoice = await askQuestion(`Choisissez une option (1 à ${totalOptions}) : `);
    const planIndex = parseInt(planChoice) - 1;
    
    if (planIndex < 0 || planIndex >= totalOptions) {
      console.log('❌ Choix invalide. Arrêt du script.');
      rl.close();
      return;
    }
    
    // Vérifier si c'est la maintenance
    if (planIndex === pricingData.plans.length) {
      await generateMaintenanceContract();
      return;
    }
    
    let selectedPlan = { ...pricingData.plans[planIndex] };
    console.log(`\n✅ Plan sélectionné : ${selectedPlan.name}\n`);
    
    // Personnalisation pour le plan "Sur Mesure"
    if (selectedPlan.type === 'custom') {
      console.log('🛠️ Personnalisation du plan "Sur Mesure" :');
      
      const customPrice = await askQuestion('Prix du projet (en euros, sans €) : ');
      if (customPrice && !isNaN(customPrice)) {
        selectedPlan.price = `${parseInt(customPrice).toLocaleString('fr-FR')}€`;
        selectedPlan.period = 'HT';
      }
      
      console.log('\n📝 Prestations incluses (appuyez sur Entrée après chaque prestation, ligne vide pour terminer) :');
      let customFeatures = [];
      let feature;
      do {
        feature = await askQuestion('> ');
        if (feature.trim()) {
          customFeatures.push(feature.trim());
        }
      } while (feature.trim());
      
      if (customFeatures.length > 0) {
        selectedPlan.features = customFeatures;
      }
    }
    
    // Remise (pour tous les plans sauf sur mesure avec prix personnalisé)
    let discount = 0;
    if (selectedPlan.price !== 'Sur devis') {
      const discountChoice = await askQuestion('\n💰 Souhaitez-vous appliquer une remise ? (o/N) : ');
      if (discountChoice.toLowerCase() === 'o' || discountChoice.toLowerCase() === 'oui') {
        const discountInput = await askQuestion('Pourcentage de remise (ex: 10 pour 10%) : ');
        const discountValue = parseFloat(discountInput);
        if (!isNaN(discountValue) && discountValue > 0 && discountValue <= 50) {
          discount = discountValue;
          console.log(`✅ Remise de ${discount}% appliquée`);
        }
      }
    }
    
    // Informations du client
    console.log('\n👤 Informations du client :');
    const clientName = await askQuestion('Nom du client (ou raison sociale) : ');
    const clientSiret = await askQuestion('SIRET du client (optionnel) : ');
    const clientEmail = await askQuestion('Email du client : ');
    
    console.log('\n📍 Adresse du client (appuyez sur Entrée après chaque ligne, ligne vide pour terminer) :');
    let addressLines = [];
    let addressLine;
    do {
      addressLine = await askQuestion('> ');
      if (addressLine.trim()) {
        addressLines.push(addressLine.trim());
      }
    } while (addressLine.trim());
    
    const clientAddress = addressLines.join('\n');
    
    // Validation des données
    if (!clientName || !clientEmail || !clientAddress) {
      console.log('❌ Toutes les informations sont obligatoires. Arrêt du script.');
      rl.close();
      return;
    }
    
    // Génération du contrat
    console.log('\n🔄 Génération du contrat en cours...');
    
    const contractData = {
      plan: selectedPlan,
      clientName,
      clientSiret: clientSiret.trim() || null,
      clientEmail,
      clientAddress,
      contractDate: formatDate(new Date()),
      contractNumber: generateContractNumber(),
      discount: discount > 0 ? discount : null
    };
    
    const generator = new ContractPDFGenerator();
    const doc = generator.generateContract(contractData);
    
    // Sauvegarde
    const outputDir = path.join(process.cwd(), 'contracts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filename = `contrat-${selectedPlan.type}-${contractData.contractNumber}.pdf`;
    const filepath = path.join(outputDir, filename);
    
    doc.save(filepath);
    
    console.log('\n🎉 Contrat généré avec succès !');
    console.log(`📄 Fichier : ${filepath}`);
    console.log(`📋 N° de contrat : ${contractData.contractNumber}`);
    console.log(`👤 Client : ${clientName}`);
    if (clientSiret.trim()) {
      console.log(`🏢 SIRET client : ${clientSiret}`);
    }
    console.log(`💼 Plan : ${selectedPlan.name}`);
    if (discount > 0) {
      console.log(`💰 Remise appliquée : ${discount}%`);
    }
    
    // Proposer de générer une facture
    const invoiceChoice = await askQuestion('\n📄 Souhaitez-vous générer une facture correspondante ? (o/N) : ');
    if (invoiceChoice.toLowerCase() === 'o' || invoiceChoice.toLowerCase() === 'oui') {
      await generateInvoice(contractData);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération :', error.message);
  } finally {
    rl.close();
  }
}

// Lancement du script
generateInteractiveContract();
