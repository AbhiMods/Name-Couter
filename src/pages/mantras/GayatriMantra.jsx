import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from '../Counters.module.css';
import SEO from '../../components/common/SEO';

const GayatriMantra = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.container} style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
            <SEO 
                title="Gayatri Mantra | गायत्री मंत्र | Meaning & Lyrics"
                description="Om Bhur Bhuva Swaha - Read valid Gayatri Mantra with Hindi meaning. Powerful Vedic mantra for wisdom and enlightenment."
                keywords="Gayatri Mantra, Gayatri Mantra Hindi, Gayatri Mantra Meaning, Om Bhur Bhuva Swaha, Vedic Mantra"
                url="https://name-counter.com/gayatri-mantra"
            />
            {/* Header */}
            <header className={styles.header} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '1rem' }}>
                    <button 
                        onClick={() => navigate(-1)}
                        style={{
                            position: 'absolute',
                            left: 0,
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-primary)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className={styles.title} style={{ fontSize: '1.8rem', margin: 0 }}>गायत्री मंत्र</h1>
                </div>
                <p className={styles.subtitle}>ॐ भूर्भुवः स्वः</p>
            </header>

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    background: 'var(--color-surface)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '24px',
                    padding: '2rem 1.5rem',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
            >
                <div style={{ 
                    fontFamily: "'Tiro Devanagari Hindi', serif", 
                    color: 'var(--color-text-primary)',
                    textAlign: 'center'
                }}>
                    
                    {/* The Mantra */}
                    <div style={{ marginBottom: '3rem' }}>
                        <p style={{ 
                            fontSize: '1.8rem', 
                            fontWeight: 'bold', 
                            lineHeight: '1.6', 
                            color: '#FFD700',
                            marginBottom: '1rem'
                        }}>
                             ॐ भूर्भुवः स्वः <br/>
                             तत्सवितुर्वरेण्यं <br/>
                             भर्गो देवस्य धीमहि <br/>
                             धियो यो नः प्रचोदयात् ॥
                        </p>
                    </div>

                    {/* Meaning Header */}
                    <h3 style={{ 
                        fontSize: '1.4rem', 
                        marginBottom: '1rem',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        paddingBottom: '0.5rem',
                        display: 'inline-block'
                    }}>
                        हिंदी में अर्थ
                    </h3>

                    {/* Meaning Text */}
                    <p style={{ 
                        fontSize: '1.2rem', 
                        lineHeight: '1.8',
                        color: 'var(--color-text-secondary)',
                        fontStyle: 'italic',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        "हम पृथ्वीलोक, भुवर्लोक और स्वर्लोक में व्याप्त उस सृष्टिकर्ता प्रकाशमान परमात्मा के तेज का ध्यान करते हैं। वह परमात्मा हमारी बुद्धि को सन्मार्ग की ओर चलने के लिए प्रेरित करे।"
                    </p>

                    <div style={{ marginTop: '3rem', fontSize: '1rem', opacity: 0.7 }}>
                        <p><strong>भावार्थ:</strong> हम ईश्वर की महिमा का ध्यान करते हैं, जिसने इस संसार को उत्पन्न किया है, जो पूजनीय है, जो ज्ञान का भंडार है। वह हमें प्रकाश दिखाए और हमें सत्य पथ पर ले जाए।</p>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default GayatriMantra;
