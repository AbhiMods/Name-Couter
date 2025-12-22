import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
    const { login, register } = useAuth();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setFormData({ email: '', password: '', confirmPassword: '', name: '' });
            setError('');
            setSuccessMsg('');
            setIsLoading(false);
        }
    }, [isOpen, initialTab]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on typing
    };

    const validate = () => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return false;
        }
        if (activeTab === 'register') {
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setError('');

        try {
            if (activeTab === 'login') {
                await login(formData.email, formData.password);
                onClose();
            } else {
                await register(formData.email, formData.password, formData.name);
                setSuccessMsg('Registration successful! Logging you in...');
                setTimeout(() => {
                    onClose();
                }, 1500);
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
        >
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'login' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('login')}
                >
                    Login
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'register' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('register')}
                >
                    Register
                </button>
            </div>

            {error && (
                <div className={styles.errorBox}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                </div>
            )}

            {successMsg && (
                <div className={styles.successBox}>
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                {activeTab === 'register' && (
                    <Input
                        label="Full Name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        icon={User}
                    />
                )}

                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                    required
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={Lock}
                    required
                />

                {activeTab === 'register' && (
                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        icon={Lock}
                        required
                    />
                )}

                {activeTab === 'login' && (
                    <a href="#" className={styles.forgotPassword} onClick={(e) => { e.preventDefault(); alert('Forgot password flow to be implemented'); }}>
                        Forgot Password?
                    </a>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    style={{ marginTop: 'var(--space-2)' }}
                >
                    {activeTab === 'login' ? 'Login' : 'Sign Up'}
                </Button>
            </form>
        </Modal>
    );
};

export default AuthModal;
