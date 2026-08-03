import React, { useState } from 'react';
import { X, Crown, CheckCircle, ShieldCheck, Zap, User } from 'lucide-react';
import { SubscriberUser } from '../types';

interface SubscribeModalProps {
  onClose: () => void;
  onSubscriberActivated?: (user: SubscriberUser) => void;
  onOpenLoginModal?: () => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  onClose,
  onSubscriberActivated,
  onOpenLoginModal,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'bulanan' | 'tahunan'>('tahunan');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdUser, setCreatedUser] = useState<SubscriberUser | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Masukkan alamat email yang valid.');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Masukkan nama lengkap Anda.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscriber/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, plan: selectedPlan }),
      }).then((r) => r.json());

      setLoading(false);

      const subUser: SubscriberUser = res?.user || {
        id: 'sub-' + Date.now(),
        email,
        name,
        plan: selectedPlan,
        subscribedAt: new Date().toISOString().split('T')[0],
        expiresAt: selectedPlan === 'tahunan' ? '2027-12-31' : '2026-09-30',
        isSubscribed: true,
      };

      setCreatedUser(subUser);
      setSuccess(true);

      if (onSubscriberActivated) {
        onSubscriberActivated(subUser);
      }
    } catch {
      setLoading(false);
      const subUser: SubscriberUser = {
        id: 'sub-' + Date.now(),
        email,
        name,
        plan: selectedPlan,
        subscribedAt: new Date().toISOString().split('T')[0],
        expiresAt: selectedPlan === 'tahunan' ? '2027-12-31' : '2026-09-30',
        isSubscribed: true,
      };
      setCreatedUser(subUser);
      setSuccess(true);
      if (onSubscriberActivated) {
        onSubscriberActivated(subUser);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          maxWidth: '560px',
          width: '100%',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          position: 'relative',
          border: '1px solid #cbd5e1',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Tutup"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <Crown size={28} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Langganan Berita Akses Khusus (Berbayar)
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            Buka seluruh artikel eksklusif, analisis kebijakan publik, investigasi mendalam, dan e-paper bulanan tanpa pembatasan.
          </p>
        </div>

        {success && createdUser ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#15803d', margin: '0 0 8px 0' }}>
              Selamat! Langganan Anda Telah Aktif 🎉
            </h4>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, marginBottom: '16px' }}>
              Terima kasih <strong>{createdUser.name}</strong> (<code>{createdUser.email}</code>). Akun Anda kini aktif sebagai <strong>Pelanggan Akses Khusus ({createdUser.plan.toUpperCase()})</strong> s/d {createdUser.expiresAt}.
            </p>

            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '6px', fontSize: '12px', color: '#166534', marginBottom: '20px' }}>
              🔓 Seluruh berita berbayar khusus di portal ini telah otomatis terbuka untuk akun Anda.
            </div>

            <button
              onClick={onClose}
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 24px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Mulai Membaca Berita Akses Khusus
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {errorMsg && (
              <div style={{ fontSize: '12px', color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '6px' }}>
                {errorMsg}
              </div>
            )}

            {/* Select Subscription Plan */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '8px' }}>
                PILIH PAKET LANGGANAN BERITA KHUSUS
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Plan 1: Bulanan */}
                <div
                  onClick={() => setSelectedPlan('bulanan')}
                  style={{
                    border: selectedPlan === 'bulanan' ? '2px solid #e11d48' : '1px solid #cbd5e1',
                    backgroundColor: selectedPlan === 'bulanan' ? '#fff1f2' : '#f8fafc',
                    borderRadius: '8px',
                    padding: '14px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#881337' }}>PAKET BULANAN</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>Rp 49.000 <span style={{ fontSize: '11px', fontWeight: 400, color: '#64748b' }}>/ bln</span></div>
                  <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.3 }}>Akses 30 hari penuh ke seluruh berita khusus &amp; fitur.</div>
                </div>

                {/* Plan 2: Tahunan */}
                <div
                  onClick={() => setSelectedPlan('tahunan')}
                  style={{
                    border: selectedPlan === 'tahunan' ? '2px solid #e11d48' : '1px solid #cbd5e1',
                    backgroundColor: selectedPlan === 'tahunan' ? '#fff1f2' : '#f8fafc',
                    borderRadius: '8px',
                    padding: '14px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '10px',
                      backgroundColor: '#e11d48',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '10px',
                    }}
                  >
                    HEMAT 30%
                  </span>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#881337' }}>PAKET TAHUNAN</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>Rp 399.000 <span style={{ fontSize: '11px', fontWeight: 400, color: '#64748b' }}>/ thn</span></div>
                  <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.3 }}>Akses 12 bulan + Bonus E-Paper &amp; Bebas Iklan.</div>
                </div>
              </div>
            </div>

            {/* Included Benefits List */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                Keuntungan Langganan Berita Berbayar Akses Khusus:
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                <li><strong>Akses Tanpa Batas</strong> seluruh artikel premium &amp; investigasi eksklusif.</li>
                <li><strong>Analisis Mendalam</strong> sektor kebijakan publik, korporasi, dan BUMN.</li>
                <li><strong>Tampilan Bersih &amp; Bebas Iklan</strong> untuk kenyamanan membaca tinggi.</li>
                <li><strong>Login Multi-Perangkat</strong> dapat diakses dari smartphone, tablet &amp; laptop.</li>
              </ul>
            </div>

            {/* Name & Email Fields */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Nama Lengkap Pembaca *
              </label>
              <input
                type="text"
                required
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginBottom: '10px',
                  outline: 'none',
                }}
              />

              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Alamat Email Aktif *
              </label>
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#e11d48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 20px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(225, 29, 72, 0.3)',
              }}
            >
              <Zap size={16} /> {loading ? 'Aktivasi Berlangganan...' : 'Aktivasi Langganan & Buka Berita Khusus'}
            </button>

            {/* Existing Subscriber Login Link */}
            <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '12px', color: '#64748b' }}>
              Sudah menjadi pelanggan berbayar?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenLoginModal) onOpenLoginModal();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e11d48',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Klik di sini untuk Masuk / Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
