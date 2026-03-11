import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Service pour générer des PDFs professionnels à partir d'éléments HTML
 */
const PdfService = {
    /**
     * Génère un PDF à partir d'un élément DOM
     * @param {string} elementId - L'ID de l'élément HTML à capturer
     * @param {string} fileName - Le nom du fichier de sortie
     * @param {object} options - Options supplémentaires (orientation, format, etc.)
     */
    generatePdf: async (elementId, fileName = 'document.pdf', options = {}) => {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with ID ${elementId} not found`);
            return;
        }

        try {
            // Configuration de html2canvas pour une haute qualité
            const canvas = await html2canvas(element, {
                scale: 2, // Augmente la résolution
                useCORS: true, // Pour les images externes
                logging: false,
                backgroundColor: '#ffffff',
                ignoreElements: (el) => el.classList.contains('no-print')
            });

            const imgData = canvas.toDataURL('image/png');

            // Calcul des dimensions A4 (210 x 297 mm)
            const pdf = new jsPDF({
                orientation: options.orientation || 'p',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgScaledWidth = imgWidth * ratio;
            const imgScaledHeight = imgHeight * ratio;

            // Centrage horizontal si nécessaire
            const marginX = (pdfWidth - imgScaledWidth) / 2;
            const marginY = 10; // Marge en haut

            pdf.addImage(imgData, 'PNG', marginX, marginY, imgScaledWidth, imgScaledHeight);
            pdf.save(fileName);

            return true;
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            throw error;
        }
    }
};

export default PdfService;
