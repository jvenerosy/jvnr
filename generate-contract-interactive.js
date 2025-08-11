const { jsPDF } = require('jspdf');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Charger les données de pricing depuis le fichier JSON
let pricingData;
try {
  const pricingPath = path.join(__dirname, 'src', 'data', 'pricing.json');
  const pricingContent = fs.readFileSync(pricingPath, 'utf8');
  pricingData = JSON.parse(pricingContent);
} catch (error) {
  console.error('❌ Erreur lors du chargement des données de pricing :', error.message);
  console.log('📁 Tentative de chargement depuis le répertoire courant...');
  
  // Fallback : essayer depuis le répertoire courant
  try {
    const fallbackPath = path.join(process.cwd(), 'src', 'data', 'pricing.json');
    const pricingContent = fs.readFileSync(fallbackPath, 'utf8');
    pricingData = JSON.parse(pricingContent);
    console.log('✅ Données de pricing chargées avec succès depuis le répertoire courant');
  } catch (fallbackError) {
    console.error('❌ Impossible de charger les données de pricing :', fallbackError.message);
    process.exit(1);
  }
}

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
    // Afficher les plans disponibles
    console.log('📋 Plans disponibles :');
    pricingData.plans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name} - ${plan.price}${plan.period ? ' ' + plan.period : ''}`);
      console.log(`   ${plan.description}\n`);
    });
    
    // Sélection du plan
    const planChoice = await askQuestion('Choisissez un plan (1, 2 ou 3) : ');
    const planIndex = parseInt(planChoice) - 1;
    
    if (planIndex < 0 || planIndex >= pricingData.plans.length) {
      console.log('❌ Choix invalide. Arrêt du script.');
      rl.close();
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