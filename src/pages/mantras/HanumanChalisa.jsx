import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from '../Counters.module.css';
import SEO from '../../components/common/SEO';

const HanumanChalisa = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.container} style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
            <SEO 
                title="Shri Hanuman Chalisa | हनुमान चालीसा | Lyrics & Meaning"
                description="Read the complete Shri Hanuman Chalisa in Hindi. Jai Hanuman Gyan Gun Sagar. Religious text for strength and devotion."
                keywords="Hanuman Chalisa, Hanuman Chalisa Hindi, Hanuman Chalisa Lyrics, Bajrang Bali, Hanuman Ji"
                url="https://name-counter.com/hanuman-chalisa" 
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
                    <h1 className={styles.title} style={{ fontSize: '1.8rem', margin: 0 }}>श्री हनुमान चालीसा</h1>
                </div>
                <p className={styles.subtitle}>संकटमोचन हनुमान जी की स्तुति</p>
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
                    fontSize: '1.2rem', 
                    lineHeight: '1.8', 
                    color: 'var(--color-text-primary)',
                    textAlign: 'center'
                }}>
                    {/* Doha */}
                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ fontWeight: 'bold', color: '#ff5722', marginBottom: '0.5rem' }}>॥ दोहा ॥</p>
                        <p>श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।</p>
                        <p>बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥</p>
                        <br/>
                        <p>बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।</p>
                        <p>बल बुद्धि बिद्या देहु मोहिं, हरहु कलेस बिकार॥</p>
                    </div>

                    {/* Chaupai */}
                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ fontWeight: 'bold', color: '#ff5722', marginBottom: '0.5rem' }}>॥ चौपाई ॥</p>
                        
                        <p>जय हनुमान ज्ञान गुन सागर।</p>
                        <p>जय कपीस तिहुँ लोक उजागर॥</p>
                        <br/>
                        <p>रामदूत अतुलित बल धामा।</p>
                        <p>अंजनि-पुत्र पवनसुत नामा॥</p>
                        <br/>
                        <p>महाबीर बिक्रम बजरंगी।</p>
                        <p>कुमति निवार सुमति के संगी॥</p>
                        <br/>
                        <p>कंचन बरन बिराज सुबेसा।</p>
                        <p>कानन कुंडल कुंचित केसा॥</p>
                        <br/>
                        <p>हाथ बज्र औ ध्वजा बिराजै।</p>
                        <p>काँधे मूँज जनेऊ साजै॥</p>
                        <br/>
                        <p>संकर सुवन केसरीनंदन।</p>
                        <p>तेज प्रताप महा जग बंदन॥</p>
                        <br/>
                        <p>विद्यावान गुनी अति चातुर।</p>
                        <p>राम काज करिबे को आतुर॥</p>
                        <br/>
                        <p>प्रभु चरित्र सुनिबे को रसिया।</p>
                        <p>राम लखन सीता मन बसिया॥</p>
                        <br/>
                        <p>सूक्ष्म रूप धरि सियहिं दिखावा।</p>
                        <p>बिकट रूप धरि लंक जरावा॥</p>
                        <br/>
                        <p>भीम रूप धरि असुर संहारे।</p>
                        <p>रामचंद्र के काज सँवारे॥</p>
                        <br/>
                        <p>लाय सजीवन लखन जियाये।</p>
                        <p>श्रीरघुबीर हरषि उर लाये॥</p>
                        <br/>
                        <p>रघुपति कीन्ही बहुत बड़ाई।</p>
                        <p>तुम मम प्रिय भरतहि सम भाई॥</p>
                        <br/>
                        <p>सहस बदन तुम्हरो जस गावैं।</p>
                        <p>अस कहि श्रीपति कंठ लगावैं॥</p>
                        <br/>
                        <p>सनकादिक ब्रह्मादि मुनीसा।</p>
                        <p>नारद सारद सहित अहीसा॥</p>
                        <br/>
                        <p>जम कुबेर दिगपाल जहाँ ते।</p>
                        <p>कबि कोबिद कहि सके कहाँ ते॥</p>
                        <br/>
                        <p>तुम उपकार सुग्रीवहिं कीन्हा।</p>
                        <p>राम मिलाय राज पद दीन्हा॥</p>
                        <br/>
                        <p>तुम्हरो मंत्र बिभीषन माना।</p>
                        <p>लंकेस्वर भए सब जग जाना॥</p>
                        <br/>
                        <p>जुग सहस्र जोजन पर भानू।</p>
                        <p>लील्यो ताहि मधुर फल जानू॥</p>
                        <br/>
                        <p>प्रभु मुद्रिका मेलि मुख माहीं।</p>
                        <p>जलधि लाँघि गये अचरज नाहीं॥</p>
                        <br/>
                        <p>दुर्गम काज जगत के जेते।</p>
                        <p>सुगम अनुग्रह तुम्हरे तेते॥</p>
                        <br/>
                        <p>राम दुआरे तुम रखवारे।</p>
                        <p>होत न आज्ञा बिनु पैसारे॥</p>
                        <br/>
                        <p>सब सुख लहै तुम्हारी सरना।</p>
                        <p>तुम रच्छक काहू को डर ना॥</p>
                        <br/>
                        <p>आपन तेज सम्हारो आपै।</p>
                        <p>तीनों लोक हाँक तें काँपै॥</p>
                        <br/>
                        <p>भूत पिसाच निकट नहिं आवै।</p>
                        <p>महाबीर जब नाम सुनावै॥</p>
                        <br/>
                        <p>नासै रोग हरै सब पीरा।</p>
                        <p>जपत निरंतर हनुमत बीरा॥</p>
                        <br/>
                        <p>संकट तें हनुमान छुड़ावै।</p>
                        <p>मन क्रम बचन ध्यान जो लावै॥</p>
                        <br/>
                        <p>सब पर राम तपस्वी राजा।</p>
                        <p>तिन के काज सकल तुम साजा॥</p>
                        <br/>
                        <p>और मनोरथ जो कोई लावै।</p>
                        <p>सोइ अमित जीवन फल पावै॥</p>
                        <br/>
                        <p>चारों जुग परताप तुम्हारा।</p>
                        <p>है परसिद्ध जगत उजियारा॥</p>
                        <br/>
                        <p>साधु संत के तुम रखवारे।</p>
                        <p>असुर निकंदन राम दुलारे॥</p>
                        <p>अष्ट सिद्धि नौ निधि के दाता।</p>
                        <p>अस बर दीन जानकी माता॥</p>
                        <br/>
                        <p>राम रसायन तुम्हरे पासा।</p>
                        <p>सदा रहो रघुपति के दासा॥</p>
                        <br/>
                        <p>तुम्हरे भजन राम को पावै।</p>
                        <p>जनम जनम के दुख बिसरावै॥</p>
                        <br/>
                        <p>अंत काल रघुबर पुर जाई।</p>
                        <p>जहाँ जन्म हरि-भक्त कहाई॥</p>
                        <br/>
                        <p>और देवता चित्त न धरई।</p>
                        <p>हनुमत सेइ सर्ब सुख करई॥</p>
                        <br/>
                        <p>संकट कटै मिटै सब पीरा।</p>
                        <p>जो सुमिरै हनुमत बलबीरा॥</p>
                        <br/>
                        <p>जै जै जै हनुमान गोसाईं।</p>
                        <p>कृपा करहु गुरुदेव की नाईं॥</p>
                        <br/>
                        <p>जो सत बार पाठ कर कोई।</p>
                        <p>छूटहि बंदि महा सुख होई॥</p>
                        <br/>
                        <p>जो यह पढ़ै हनुमान चालीसा।</p>
                        <p>होय सिद्धि साखी गौरीसा॥</p>
                        <br/>
                        <p>तुलसीदास सदा हरि चेरा।</p>
                        <p>कीजै नाथ हृदय मँह डेरा॥</p>
                    </div>

                    {/* Doha */}
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontWeight: 'bold', color: '#ff5722', marginBottom: '0.5rem' }}>॥ दोहा ॥</p>
                        <p>पवन तनय संकट हरन, मंगल मूरति रूप।</p>
                        <p>राम लखन सीता सहित, हृदय बसहु सुर भूप॥</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HanumanChalisa;
