// 🔐 Sistema de Autenticação Mock (localStorage)
// Em produção, substituir por Supabase/Firebase/NextAuth

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  quizCompleted: boolean;
  createdAt: string;
}

export interface QuizAnswers {
  goal: string;
  frequency: string;
  location: string;
  duration: string;
  restrictions: string[];
  preferences: string[];
  experience: string;
}

// Chave para localStorage
const AUTH_KEY = 'fitai_auth_user';
const USERS_KEY = 'fitai_users';
const QUIZ_KEY = 'fitai_quiz_answers';

// Simular banco de usuários
function getUsers(): Record<string, AuthUser & { password: string }> {
  if (typeof window === 'undefined') return {};
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
}

function saveUsers(users: Record<string, AuthUser & { password: string }>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Criar conta
export async function signup(name: string, email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    // Validações
    if (!name || name.length < 2) {
      return { success: false, error: 'Nome deve ter pelo menos 2 caracteres' };
    }

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Email inválido' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' };
    }

    const users = getUsers();

    // Verificar se email já existe
    if (Object.values(users).some(u => u.email === email)) {
      return { success: false, error: 'Email já cadastrado' };
    }

    // Criar usuário
    const user: AuthUser = {
      id: Date.now().toString(),
      name,
      email,
      quizCompleted: false,
      createdAt: new Date().toISOString(),
    };

    users[user.id] = { ...user, password };
    saveUsers(users);

    // Salvar sessão
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Erro ao criar conta' };
  }
}

// Login
export async function login(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email e senha são obrigatórios' };
    }

    const users = getUsers();
    const userEntry = Object.values(users).find(u => u.email === email);

    if (!userEntry || userEntry.password !== password) {
      return { success: false, error: 'Email ou senha incorretos' };
    }

    const { password: _, ...user } = userEntry;

    // Salvar sessão
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Erro ao fazer login' };
  }
}

// Logout
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

// Obter usuário atual
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(AUTH_KEY);
  return user ? JSON.parse(user) : null;
}

// Verificar se está autenticado
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Atualizar status do quiz
export function markQuizCompleted(answers: QuizAnswers): void {
  if (typeof window === 'undefined') return;
  
  const user = getCurrentUser();
  if (!user) return;

  // Atualizar usuário
  user.quizCompleted = true;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

  // Salvar respostas do quiz
  localStorage.setItem(QUIZ_KEY, JSON.stringify(answers));

  // Atualizar no "banco"
  const users = getUsers();
  if (users[user.id]) {
    users[user.id].quizCompleted = true;
    saveUsers(users);
  }
}

// Obter respostas do quiz
export function getQuizAnswers(): QuizAnswers | null {
  if (typeof window === 'undefined') return null;
  const answers = localStorage.getItem(QUIZ_KEY);
  return answers ? JSON.parse(answers) : null;
}

// Verificar se precisa redirecionar
export function getRedirectPath(): string {
  const user = getCurrentUser();
  
  if (!user) {
    return '/login';
  }
  
  if (!user.quizCompleted) {
    return '/quiz';
  }
  
  return '/dashboard';
}
