# Procedure per Scrivere Clean Code in PHP: Guida Pratica alla Mano

La qualità del codice scritto manualmente dipende da **abitudini mentali consapevoli**, non da strumenti. Eccovi un manuale operativo strutturato per applicare il clean code durante la scrittura, non dopo la compilazione.

---

## 1. Le Tre Regole del Naming (Il Fondamento)

Il nome è il primo meccanismo di comunicazione tra te e il lettore del codice. Un nome cattivo crea confusione; un nome buono rende il codice auto-esplicativo.

### Regola 1: Usare Nomi Univoci e Specifici

Non scrivere mai nomi generici come `$data`, `$val`, `$temp`, `$obj`. Ogni variabile deve raccontare cosa contiene.

| Cattivo | Buono | Perché |
| :--- | :--- | :--- |
| `$d = fetchUser(1);` | `$currentUser = userRepository->findById(1);` | Il nome esplicita il ruolo: è l'utente corrente, non un generico "dato". |
| `$result = calculate();` | `$monthlyRevenue = revenueCalculator->compute();` | Specifico: si sa esattamente cosa viene calcolato. |
| `$x = 5;` | `$maxRetryAttempts = 5;` | Un numero nudo è inutile; il contesto lo rende comprensibile. |

### Regola 2: Coniugare i Verbi per le Azioni

I metodi eseguono azioni, quindi i loro nomi devono iniziare con un verbo. Utilizza sempre il tempo presente, in terza persona singolare.

```php
// ❌ Sbagliato
function getUserData() { ... }
function isLoggedInStatus() { ... }
function creatingNewPost() { ... }

// ✅ Corretto
function getUserData() { ... }  // verbo: get
function isLoggedIn() { ... }   // verbo: is (booleano)
function createPost() { ... }   // verbo: create
function hasPermission() { ... } // verbo: has (booleano)
function validateEmail() { ... } // verbo: validate
function deleteExpiredSessions() { ... } // verbo: delete
```

### Regola 3: PascalCase per Classi, camelCase per Tutto Altro

Questo crea una separazione visiva immediata tra "tipi" e "istanze".

```php
// ✅ Corretto
class UserAccountManager { ... }
class InvoiceGenerator { ... }

public function calculateTotalPrice() { ... }
private $maxRetryAttempts = 3;
```

---

## 2. Single Responsibility Principle (SRP): Una Classe, Una Ragione per Cambiare

Una classe deve avere **una sola responsabilità**. Se una classe ha più di un motivo per cambiare, è troppo complessa.

**Test Pratico:** Riesci a descrivere cosa fa la classe in una sola frase senza usare "e", "inoltre", "anche"?

### Esempio di Violazione:

```php
// ❌ CATTIVO: UserManager fa 3 cose diverse
class UserManager {
    public function createUser($email, $password) { ... }
    
    public function sendWelcomeEmail($userId) { ... }  // ← Email
    
    public function saveToDatabase($userData) { ... }  // ← Database
    
    public function validateUserPermissions($userId) { ... }  // ← Autorizzazione
}
```

Questa classe cambierebbe per 4 motivi diversi (creazione utente, invio email, logica database, autorizzazione). Inoltre è impossibile da testare isolatamente.

### Esempio di Applicazione Corretta:

```php
// ✅ BUONO: Responsabilità separate

class UserRepository {
    public function create(UserData $userData): User { ... }
    public function findById(int $id): ?User { ... }
}

class EmailService {
    public function sendWelcome(User $user): void { ... }
}

class PermissionChecker {
    public function canEdit(User $actor, User $target): bool { ... }
}

// Utilizzo: il Controller orchestrate le dipendenze
class UserController {
    public function __construct(
        private UserRepository $repo,
        private EmailService $emailer,
        private PermissionChecker $permissions
    ) {}
    
    public function register(RegisterRequest $request) {
        $user = $this->repo->create($request->toUserData());
        $this->emailer->sendWelcome($user);
        return $user;
    }
}
```

**Benefici del SRP:**
- Ogni classe è testabile isolatamente.
- Se la logica email cambia, non tocchi il repository.
- Il codice è più riutilizzabile (puoi usare `UserRepository` in 10 contesti diversi).

---

## 3. Evitare i Code Smells: Pattern Pericolosi da Riconoscere

I **code smells** sono segnali visivi che il codice potrebbe nascondere bug o cattiva design. Li riconosci durante la scrittura.

### Smell 1: Metodi Troppo Lunghi (Long Methods)

Un metodo dovrebbe fare UNA cosa e stare in una sola schermata (max 30-40 righe).

```php
// ❌ CATTIVO: Metodo lungo e confuso
public function processOrder($orderId) {
    $order = $this->db->query("SELECT * FROM orders WHERE id = ?", $orderId);
    
    if ($order['status'] !== 'pending') return false;
    
    $total = 0;
    foreach ($order['items'] as $item) {
        $product = $this->db->query("SELECT price FROM products WHERE id = ?", $item['product_id']);
        $total += $product['price'] * $item['quantity'];
    }
    
    if ($total < 0) return false;
    
    $tax = $total * 0.22;
    $finalTotal = $total + $tax;
    
    $this->db->query("UPDATE orders SET total = ?, status = 'completed' WHERE id = ?", $finalTotal, $orderId);
    
    $this->mail->send($order['customer_email'], "Order " . $orderId . " confirmed!");
    
    return true;
}

// ✅ BUONO: Suddiviso in metodi piccoli
public function processOrder(Order $order): bool {
    if (!$order->isPending()) return false;
    
    $order->calculateTotal();
    
    if (!$order->isValid()) return false;
    
    $this->orderRepository->save($order);
    $this->emailService->sendConfirmation($order);
    
    return true;
}

private function calculateTotal(Order $order): void {
    $subtotal = $order->items()->sum(fn($item) => $item->price * $item->quantity);
    $tax = $subtotal * 0.22;
    $order->setTotal($subtotal + $tax);
}
```

### Smell 2: Nesting Profondo (Deeply Nested Blocks)

Più di 3 livelli di indentazione rende il codice difficile da seguire. Usa **Early Return** (guard clause).

```php
// ❌ CATTIVO: If annidati (piramide)
public function validateUser($email, $password) {
    if (!empty($email)) {
        if (!empty($password)) {
            if (strlen($password) >= 8) {
                if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// ✅ BUONO: Guard clauses (escape subito se il problema)
public function validateUser(string $email, string $password): bool {
    if (empty($email)) return false;
    if (empty($password)) return false;
    if (strlen($password) < 8) return false;
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) return false;
    
    return true;
}
```

Il codice "buono" è **più facile da leggere** perché leggi le condizioni d'errore sequenzialmente, poi raggiunggi la logica principale.

### Smell 3: Duplicazione di Codice (Don't Repeat Yourself - DRY)

Se scrivi la stessa logica due volte, estrai in una funzione riutilizzabile.

```php
// ❌ CATTIVO: Logica duplicata
public function calculateUserDiscount() {
    $discount = 0;
    if ($this->user->isPremium()) {
        $discount = $this->user->purchaseAmount * 0.15;
    } else {
        $discount = $this->user->purchaseAmount * 0.05;
    }
    return $discount;
}

public function calculatePartnerDiscount() {
    $discount = 0;
    if ($this->partner->isPremium()) {
        $discount = $this->partner->purchaseAmount * 0.15;
    } else {
        $discount = $this->partner->purchaseAmount * 0.05;
    }
    return $discount;
}

// ✅ BUONO: Logica centralizzata
private function calculateDiscount(Customer $customer): float {
    $rate = $customer->isPremium() ? 0.15 : 0.05;
    return $customer->purchaseAmount * $rate;
}

public function calculateUserDiscount(): float {
    return $this->calculateDiscount($this->user);
}

public function calculatePartnerDiscount(): float {
    return $this->calculateDiscount($this->partner);
}
```

### Smell 4: Troppi Parametri (Long Parameter Lists)

Se un metodo ha più di 3-4 parametri, è difficile da usare e testare. Raggruppa gli attributi in un **Value Object** o **DTO** (Data Transfer Object).

```php
// ❌ CATTIVO: Troppe variabili
public function createInvoice($customerId, $companyName, $email, $address, 
                              $city, $zipCode, $country, $items) { ... }

// ✅ BUONO: Raggruppamento logico
public function createInvoice(int $customerId, InvoiceData $data): Invoice {
    // $data è un object con tutte le proprietà correlate
    ...
}

// In alternativa (se usi PHP 8+):
public function createInvoice(
    int $customerId,
    string $companyName,
    string $email,
    Address $address,  // Value Object che racchiude city, zipCode, country
    array $items
): Invoice { ... }
```

---

## 4. Tipizzazione: L'Arma Segreta della Chiarezza

In PHP 8+, la tipizzazione forte trasforma i DocBlock in dichiarazioni di tipo. Il tuo code diventa **auto-documentante**.

```php
// ❌ CATTIVO: DocBlock obsoleto
class UserService {
    /**
     * @param int $userId
     * @param string $email
     * @return User|null
     */
    public function updateEmail($userId, $email) {
        // Non si sa cosa ritorna davvero
    }
}

// ✅ BUONO: Type hints chiari
class UserService {
    public function updateEmail(int $userId, Email $email): ?User {
        // Il tipo è esplicito. Se passi una stringa al posto di Email, PHP ti ferma
        // If ritorna null, è intenzionale (l'utente potrebbe non esistere)
    }
    
    public function activate(User $user): void {
        // void significa: questo metodo NON ritorna nulla
    }
}
```

**Bonus in PHP 8.3+:** Usa `readonly` per proprietà immutabili:

```php
class Email {
    public function __construct(
        public readonly string $address,
        public readonly bool $isVerified = false
    ) {}
    
    // Una volta creata, non può essere modificata. Immutabilità garantita.
}
```

---

## 5. Commenti: Quando Scriverli (e Quando Non Scriverli)

Il 95% dei commenti è **rumore**. Usa il codice stesso per comunicare. I commenti devono spiegare il **"perché"**, non il **"cosa"**.

```php
// ❌ CATTIVO: Commento evidente (il codice già lo dice)
$user = $this->userRepository->findById($id);  // Prende l'utente dal database

// ❌ CATTIVO: Commento che nasconde cattiva design
$result = $this->complexCalculation();  // TODO: Capire cosa fa questo

// ✅ BUONO: Commento che spiega una scelta architetturale
// We cache the user for 1 hour because the permission system
// is eventually consistent and we want to avoid authorization delays
$user = $this->cache->remember("user_{$id}", 3600, fn() => 
    $this->userRepository->findById($id)
);

// ✅ BUONO: Commento su logica non ovvia
// Fibonacci cache reset is required before calculating new sequences
// because the static state persists across test runs
$this->fibCache->reset();
```

**Regola d'Oro:** Se senti il bisogno di scrivere un commento, considera se il codice può essere **rinominato o ristrutturato** per essere auto-esplicativo.

---

## 6. Gestione delle Dipendenze: Dependency Injection vs. Static Calls

Evita le chiamate statiche. Usa l'iniezione di dipendenze per rendere il codice testabile e disaccoppiato.

```php
// ❌ CATTIVO: Dipendenza statica (tight coupling)
class OrderService {
    public function process(Order $order) {
        $validator = OrderValidator::validate($order);  // Chiamata statica
        $notifier = EmailNotifier::notify($order);      // Legato al framework
    }
}
// Non puoi testare OrderService senza EmailNotifier. Se cambia EmailNotifier, rompi il codice.

// ✅ BUONO: Dipendenza iniettata
class OrderService {
    public function __construct(
        private OrderValidator $validator,
        private OrderNotifier $notifier
    ) {}
    
    public function process(Order $order): void {
        $this->validator->validate($order);
        $this->notifier->notify($order);
    }
}
// Puoi iniettare mock durante i test. Se cambia il sistema di notifica, cambi solo il binding.
```

---

## 7. Checklist di Auto-Review Prima di Committare

Prima di fare commit, chiediti:

- [ ] **Nomi:** Ogni variabile, funzione e classe ha un nome che esprime il suo scopo?
- [ ] **SRP:** Questa classe ha più di una ragione per cambiare?
- [ ] **Lunghezza:** Il metodo più lungo è < 40 righe? Se no, estrai in metodi più piccoli.
- [ ] **Nesting:** C'è un if annidato più di 3 livelli? Se sì, usa guard clauses.
- [ ] **Parametri:** Il metodo ha > 4 parametri? Se sì, raggruppa in Value Object.
- [ ] **Duplicazione:** Questa logica esiste già altrove nel progetto? Se sì, rifattorizza.
- [ ] **Tipizzazione:** Ogni parametro e return type hanno un tipo dichiarato? (Strict types abilitati?)
- [ ] **Commenti:** Ogni commento spiega il "perché", non il "cosa"?
- [ ] **Dipendenze:** Uso Dependency Injection o Static Calls? (Preferisci sempre DI)

---

## 8. Tabella Rapida: Pattern Antilogia

| Anti-Pattern | Segnale di Allarme | Soluzione |
| :--- | :--- | :--- |
| Classe "God" | "Fa troppo" | Estrai responsabilità in classi separate (SRP) |
| Metodo Lungo | 50+ righe | Suddividi in metodi più piccoli (Extract Method) |
| Parametri Molti | 5+ parametri | Crea un DTO o Value Object |
| Nesting Profondo | if dentro if dentro if | Usa guard clauses (early return) |
| Duplicazione | Stesso codice 2+ volte | Estrai in funzione riutilizzabile |
| Variabili Generiche | `$data`, `$x`, `$result` | Rinomina con nomi specifici |
| Commenti Ovvi | `// incrementa i` | Rimuovi il commento; il codice lo dice |
| Chiamate Statiche | `User::find(1)` | Usa Dependency Injection |
| Type Ambiguo | Nessun type hint | Aggiungi type declarations (strict_types=1) |

---

## Conclusione: La Mentalità del Clean Code

Scrivere clean code non è una fase di refactoring post-scritura. È una **mentalità during scripting**. Ogni volta che scrivi una riga:

1. Chiediti se il nome è chiaro.
2. Verifica che la funzione faccia una sola cosa.
3. Evita la duplicazione.
4. Scegli i tipi corretti.
5. Mantieni il nesting basso.

Con queste abitudini, il tuo codice rimane **mantenibile, testabile e leggibile** da subito, senza bisogno di refactoring massiccio successivamente.