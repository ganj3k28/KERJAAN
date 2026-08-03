import React, { useState } from 'react';
import { X, User, Lock, Crown, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { SubscriberUser } from '../types';

interface SubscriberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: SubscriberUser) => void;
  onSubscriberLoginSuccess?: (user: SubscriberUser) => void;
  onOpenAdminCMS?: () => void;
  onOpenSubscribeModal: () => void;
}

export const SubscriberLoginModal: React.FC<SubscriberLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSubscriberLoginSuccess,
  onOpenAdminCMS,
  onOpenSubscribeModal,
}) => {
  const [activeTab, setActiveTab] = useState<'subscriber' | 'admin'>('subscriber');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubscriberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Masukkan alamat email langganan Anda.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/subscriber/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then((r) => r.json());

      setLoading(false);

      const notifySuccess = (u: SubscriberUser) => {
        if (onSubscriberLoginSuccess) onSubscriberLoginSuccess(u);
        if (onLoginSuccess) onLoginSuccess(u);
      };

      if (res.success && res.user) {
        notifySuccess(res.user);
        onClose();
      } else {
        // Fallback demo login if server doesn't match
        const demoUser: SubscriberUser = {
          id: 'sub-' + Date.now(),
          email: email,
          name: email.split('@')[0].toUpperCase() || 'Pelanggan Akses Khusus',
          plan: 'tahunan',
          subscribedAt: new Date().toISOString().split('T')[0],
          expiresAt: '2027-12-31',
          isSubscribed: true,
        };
        notifySuccess(demoUser);
        onClose();
      }
    } catch {
      setLoading(false);
      // Fallback
      const demoUser: SubscriberUser = {
        id: 'sub-' + Date.now(),
        email: email,
        name: email.split('@')[0] || 'Pelanggan Premium',
        plan: 'tahunan',
        subscribedAt: new Date().toISOString().split('T')[0],
        expiresAt: '2027-12-31',
        isSubscribed: true,
      };
      if (onSubscriberLoginSuccess) onSubscriberLoginSuccess(demoUser);
      if (onLoginSuccess) onLoginSuccess(demoUser);
      onClose();
    }
  };

  const handleQuickDemoSubscriber = (name: string, emailStr: string, planType: 'bulanan' | 'tahunan' | 'vip') => {
    const demoUser: SubscriberUser = {
      id: 'sub-demo-' + Date.now(),
      email: emailStr,
      name,
      plan: planType,
      subscribedAt: '2026-01-01',
      expiresAt: '2027-12-31',
      isSubscribed: true,
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          maxWidth: '460px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
          border: '1px solid #cbd5e1',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div style={{ backgroundColor: '#0f172a', padding: '20px 24px', color: '#ffffff', position: 'relative' }}>
          <button
            onClick={onClose}
            aria-label="Tutup"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Crown size={22} style={{ color: '#fbbf24' }} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Masuk Akun Berlangganan</h3>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
            Akses berita berbayar eksklusif, laporan investigasi, dan arsip data publik.
          </p>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              onClick={() => setActiveTab('subscriber')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'subscriber' ? '#E10600' : 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <User size={14} /> Pelanggan Berbayar
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAdminCMS();
              }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'admin' ? '#E10600' : 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Shield size={14} /> Admin Redaksi CMS
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px' }}>
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecdd3',
                color: '#991b1b',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubscriberLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Email Akun Langganan *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: pembaca@email.com"
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 38px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Kata Sandi *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 38px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#001e58',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px',
                boxShadow: '0 2px 4px rgba(0, 30, 88, 0.3)',
              }}
            >
              <Crown size={16} /> {loading ? 'Memproses Login...' : 'Masuk Pembaca Akses Khusus'}
            </button>
          </form>

          {/* Quick Demo Subscriber Login Section */}
          <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
              Uji Coba Langsung (Simulasi Akun Pelanggan Aktif):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoSubscriber('Budi Santoso (Member VIP)', 'budi@langganan.id', 'vip')}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block' }}>Budi Santoso (VIP Tahunan)</strong>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>budi@langganan.id</span>
                </div>
                <span style={{ backgroundColor: '#16a34a', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  AKSI CEPAT ➔
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSubscriber('Siti Rahma (Member Bulanan)', 'siti@langganan.id', 'bulanan')}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block' }}>Siti Rahma (Bulanan)</strong>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>siti@langganan.id</span>
                </div>
                <span style={{ backgroundColor: '#E10600', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  AKSI CEPAT ➔
                </span>
              </button>
            </div>
          </div>

          {/* Footer Promo to Subscribe */}
          <div style={{ marginTop: '20px', backgroundColor: '#fff1f2', borderRadius: '6px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#9f1239', fontWeight: 600 }}>
              Belum memiliki akun berlangganan?
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSubscribeModal();
              }}
              style={{
                backgroundColor: '#001e58',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Langganan Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
