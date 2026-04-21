import { jsPDF } from 'jspdf';

export const generateCertificatePDF = (certData) => {
  const { studentName, courseTitle, issueDate, verificationCode } = certData;
  const date = new Date(issueDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // --- Background Design ---
  // Large border
  doc.setDrawColor(33, 150, 243); // Primary Color
  doc.setLineWidth(2);
  doc.rect(5, 5, width - 10, height - 10);
  
  // Outer double border
  doc.setLineWidth(0.5);
  doc.rect(8, 8, width - 16, height - 16);

  // Decorative corners
  const cornerSize = 30;
  doc.setFillColor(33, 150, 243, 0.1);
  doc.triangle(5, 5, 5 + cornerSize, 5, 5, 5 + cornerSize, 'F');
  doc.triangle(width - 5, 5, width - 5 - cornerSize, 5, width - 5, 5 + cornerSize, 'F');
  doc.triangle(5, height - 5, 5 + cornerSize, height - 5, 5, height - 5 - cornerSize, 'F');
  doc.triangle(width - 5, height - 5, width - 5 - cornerSize, height - 5, width - 5, height - 5 - cornerSize, 'F');

  // --- Header ---
  doc.setTextColor(33, 33, 33);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(40);
  doc.text('CERTIFICAT DE RÉUSSITE', width / 2, 45, { align: 'center' });

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(width / 2 - 40, 52, width / 2 + 40, 52);

  // --- Body ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text('Ce certificat est fièrement décerné à', width / 2, 75, { align: 'center' });

  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(32);
  doc.setTextColor(33, 150, 243);
  doc.text(studentName, width / 2, 95, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text('pour avoir complété avec succès le cours', width / 2, 115, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(33, 33, 33);
  doc.text(courseTitle, width / 2, 130, { align: 'center' });

  // --- Footer ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.text(`Délivré le ${date}`, width / 2, 160, { align: 'center' });

  // Verification area
  doc.setFontSize(10);
  doc.text(`Code de vérification : ${verificationCode}`, width / 2, 185, { align: 'center' });
  
  // Platform name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(33, 150, 243);
  doc.text('E-Learning Platform', width / 2, 175, { align: 'center' });

  // Save the PDF
  doc.save(`Certificat_${courseTitle.replace(/\s+/g, '_')}.pdf`);
};
