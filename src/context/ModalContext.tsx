import { createContext, useState, useCallback, type ReactNode } from 'react';

type ModalType = 'alert' | 'confirm' | 'prompt';

interface ModalOptions {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    placeholder?: string;
    isSecret?: boolean; // For password prompt
}

interface ModalContextType {
    showAlert: (message: string, options?: ModalOptions) => Promise<void>;
    showConfirm: (message: string, options?: ModalOptions) => Promise<boolean>;
    showPrompt: (message: string, options?: ModalOptions) => Promise<string | null>;
    modalState: ModalState | null;
    closeModal: (result: any) => void;
}

interface ModalState extends ModalOptions {
    type: ModalType;
    resolve: (value: any) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalState, setModalState] = useState<ModalState | null>(null);

    const showAlert = useCallback((message: string, options?: ModalOptions) => {
        return new Promise<void>((resolve) => {
            setModalState({
                type: 'alert',
                message,
                resolve,
                title: options?.title || '알림',
                confirmText: options?.confirmText || '확인',
                ...options
            });
        });
    }, []);

    const showConfirm = useCallback((message: string, options?: ModalOptions) => {
        return new Promise<boolean>((resolve) => {
            setModalState({
                type: 'confirm',
                message,
                resolve,
                title: options?.title || '확인',
                confirmText: options?.confirmText || '예',
                cancelText: options?.cancelText || '아니오',
                ...options
            });
        });
    }, []);

    const showPrompt = useCallback((message: string, options?: ModalOptions) => {
        return new Promise<string | null>((resolve) => {
            setModalState({
                type: 'prompt',
                message,
                resolve,
                title: options?.title || '입력 요청',
                confirmText: options?.confirmText || '확인',
                cancelText: options?.cancelText || '취소',
                isSecret: options?.isSecret || false,
                placeholder: options?.placeholder || '',
                ...options
            });
        });
    }, []);

    const closeModal = useCallback((result: any) => {
        if (modalState) {
            modalState.resolve(result);
            setModalState(null);
        }
    }, [modalState]);

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm, showPrompt, modalState, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};
