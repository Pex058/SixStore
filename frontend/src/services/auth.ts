import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './firebase';

export const ADMIN_AUTHORIZED_EMAILS = [
  'pauloedu1985@gmail.com'
];

export const isEmailAutorizado = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_AUTHORIZED_EMAILS.some(
    authEmail => authEmail.toLowerCase() === email.trim().toLowerCase()
  );
};

export const loginAdminComGoogle = async (): Promise<User> => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Authentication não está configurado.');
  }

  const firebaseAuth = auth;

  try {
    const credencial = await signInWithPopup(firebaseAuth, googleProvider);
    const user = credencial.user;

    if (!user.email || !isEmailAutorizado(user.email)) {
      await signOut(firebaseAuth);
      throw new Error(
        `Acesso não autorizado! A conta Google (${user.email || 'desconhecida'}) não tem permissão para acessar o painel admin. Somente ${ADMIN_AUTHORIZED_EMAILS.join(', ')} está autorizada.`
      );
    }

    return user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('A janela de login com Google foi fechada antes de concluir.');
    }
    if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('A tentativa de login anterior foi cancelada.');
    }
    if (error.code === 'auth/popup-blocked') {
      throw new Error('O navegador bloqueou a janela pop-up do Google. Por favor, permita pop-ups para este site.');
    }
    throw error;
  }
};

export const logoutAdmin = async (): Promise<void> => {
  if (auth) {
    await signOut(auth);
  }
};

export const monitorarAuthAdmin = (
  aoMudarUsuario: (user: User | null) => void,
  aoErroNaoAutorizado?: (mensagem: string) => void
) => {
  if (!isFirebaseConfigured || !auth) {
    aoMudarUsuario(null);
    return () => {};
  }

  const firebaseAuth = auth;

  return onAuthStateChanged(firebaseAuth, async (user) => {
    if (user) {
      if (isEmailAutorizado(user.email)) {
        aoMudarUsuario(user);
      } else {
        await signOut(firebaseAuth);
        aoMudarUsuario(null);
        if (aoErroNaoAutorizado) {
          aoErroNaoAutorizado(
            `Acesso não autorizado: O e-mail Google "${user.email}" não está na lista de administradores permitidos.`
          );
        }
      }
    } else {
      aoMudarUsuario(null);
    }
  });
};
