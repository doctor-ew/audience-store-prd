import LanguageSwitcher from '@/components/LanguageSwitcher';

 export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <LanguageSwitcher />
        </>
    );
 }
