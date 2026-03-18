import { useState } from 'react';
import './Receipt.css';
import PdfService from '../services/PdfService';
import { toast } from 'react-hot-toast';

const Receipt = ({ data }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    if (!data) return null;

    const {
        id,
        item,
        quantity,
        price,
        dateRaw,
        requesterDetails,
        recipientDetails,
        type
    } = data;

    const date = new Date(dateRaw).toLocaleDateString('fr-FR');
    const total = quantity * price;
    const orderNumber = `#CMD-${new Date(dateRaw).getFullYear()}-${id.toString().padStart(3, '0')}`;

    // Le récepteur (celui qui imprime en général le bon de livraison est celui qui envoie, donc le vendeur)
    // Mais ici le "RECU" semble être émis par la pharmacie émettrice.

    const handleDownload = async () => {
        setIsGenerating(true);
        const toastId = toast.loading('Génération du PDF...');
        try {
            await PdfService.generatePdf('printable-receipt', `Bon_Livraison_${orderNumber}.pdf`);
            toast.success('PDF généré avec succès', { id: toastId });
        } catch {
            toast.error('Erreur lors de la génération du PDF', { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="receipt-container" id="printable-receipt">
            <div className="receipt-header-bar"></div>

            <div className="receipt-content">
                <div className="receipt-top">
                    <div className="issuer-info">
                        <h2 className="pharmacy-name">{recipientDetails.nom || 'PHARMACIE PARTENAIRE'}</h2>
                        <p>{recipientDetails.adresse || '-'}</p>
                        <p>{recipientDetails.telephone || '-'}</p>
                    </div>
                    <div className="receipt-label">
                        <h1>REÇU</h1>
                    </div>
                </div>

                <div className="receipt-meta">
                    <div className="meta-left">
                        <p><strong>Émis par :</strong> {recipientDetails.responsable || recipientDetails.nom}</p>
                        <p style={{ marginTop: '1.5rem' }}><strong>Destinataire (Partenaire) :</strong> {requesterDetails.nom}</p>
                    </div>
                    <div className="meta-right">
                        <p><strong>N° :</strong> <span className="order-num">{orderNumber}</span></p>
                        <p><strong>Date :</strong> {date}</p>
                    </div>
                </div>

                <table className="receipt-table">
                    <thead>
                        <tr>
                            <th>Désignation</th>
                            <th>Quantité</th>
                            <th>P.U. (FCFA)</th>
                            <th>Total (FCFA)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{item}</td>
                            <td>{quantity}</td>
                            <td>{price.toLocaleString()} FCFA</td>
                            <td>{total.toLocaleString()} FCFA</td>
                        </tr>
                        {type.toLowerCase().includes('échange') && (
                            <tr className="promo-row">
                                <td>{type}</td>
                                <td>1</td>
                                <td>-</td>
                                <td>Gratuit</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="receipt-totals">
                    <div className="totals-box">
                        <div className="total-line">
                            <span>Sous-total :</span>
                            <span>{total.toLocaleString()} FCFA</span>
                        </div>
                        <div className="total-line net">
                            <span>TOTAL NET :</span>
                            <span>{total.toLocaleString()} FCFA</span>
                        </div>
                    </div>
                </div>

                <div className="receipt-footer">
                    <div className="qr-section">
                        <div className="qr-placeholder">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                                <path d="M14 14h3m3 0h1m-4 3h1m3 0h1m-4 3h4m-4-7v4m4-4v4"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="signature-section">
                        <div className="signature-box">
                            <p>Cachet & Signature Émetteur</p>
                            <div className="sig-line"></div>
                        </div>
                        <div className="signature-box">
                            <p>Signature Réceptionnaire</p>
                            <div className="sig-line"></div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', fontSize: '0.7rem', color: '#666', borderTop: '1px solid #eee', paddingTop: '1rem', textAlign: 'justify' }}>
                    <strong>Mention Légale (Conformité AIRP) :</strong> Ce document atteste d'un dépannage confraternel exceptionnel, sans marge commerciale (cession à prix grossiste ou échange), conçu pour répondre aux besoins de santé publique. Conformément aux bonnes pratiques de distribution, le transport physique du médicament et le strict respect de la chaîne du froid (le cas échéant) engagent la responsabilité exclusive du pharmacien réceptionnaire ou de son mandataire. La plateforme logicielle <em>PharmShare</em> décline toute responsabilité liée au transport, au courtage, ou à l'altération qualitative du produit post-cession.
                </div>
            </div>

            <div className="receipt-actions no-print">
                <button
                    className="btn btn-primary btn-pro-pdf"
                    onClick={handleDownload}
                    disabled={isGenerating}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    {isGenerating ? 'Impression...' : 'Imprimer'}
                </button>
            </div>
        </div>
    );
};

export default Receipt;
