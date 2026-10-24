# UI/UX Wireframes Document - AI Assistant Agent Extension

## 1. Overview
The AI Assistant Agent is an intelligent overlay integrated into the existing e-commerce website. It acts as a persistent shopping companion, allowing users to search for products, manage their cart, and checkout using natural language commands. The design focuses on accessibility, unobtrusiveness, and clear communication of agent status.

## 2. User Flows

### Flow A: Product Discovery & Add to Cart
1.  **Start**: User clicks the "Ask Agent" floating button on the Homepage.
2.  **Interaction**: User types "Find me blue running shoes under $100".
3.  **Response**: Agent displays a carousel of 3 relevant products.
4.  **Action**: User clicks "Add to Cart" on a product card OR types "Add the second one".
5.  **Confirmation**: Agent confirms item added and shows updated cart total.

### Flow B: Agent-Led Checkout
1.  **Start**: User types "I want to checkout" in the chat.
2.  **Verification**: Agent displays stored shipping address and asks for confirmation.
3.  **Action**: User confirms "Yes, that's correct".
4.  **Payment**: Agent confirms card ending in 1234.
5.  **Completion**: Agent processes payment and displays Order Success message with Order ID.

## 3. Screen List
Since the Agent is an overlay, it does not require entirely new full-page screens, but rather new **Interface States**:
1.  **Floating Action Button (FAB) State**: Collapsed view.
2.  **Chat Interface (Expanded) State**: Main interaction window.
3.  **Product Card Component**: Rich message format for products.
4.  **Checkout Confirmation Modal**: Specialized view for securing transactions.

## 4. Wireframe Descriptions & Samples

### 4.1. Global Chat Widget (Collapsed)
*   **Purpose**: To provide quick access to the Agent without obstructing the main shopping experience.
*   **Layout**: Bottom-right corner of the viewport.
*   **Key Functionalities**:
    *   Hover effect showing "Ask AI Assistant".
    *   Click to expand Chat Interface.
    *   Notification badge for unread messages.

**Sample Wireframe:**
```text
+------------------------------------------------------+
|  [ E-Commerce Header Navigation ]                    |
|                                                      |
|  [ Hero Banner ... ]                                 |
|                                                      |
|                                                      |
|                                                      |
|                                                      |
|                                         (  Based  )  |
|                                         (   on    )  |
|                                         (  Robot  )  |
|                                         (  Icon   )  |
+------------------------------------------------------+
```

### 4.2. Chat Interface (Expanded)
*   **Purpose**: The main area for conversation, product display, and command input.
*   **Layout**:
    *   **Header**: Agent Name, Close button, Clear Chat option.
    *   **Message Area**: Scrollable area showing history. User messages align right; Agent messages align left.
    *   **Input Area**: Text box, Send button, Microphone icon (optional for future voice support).
*   **Key Functionalities**:
    *   Auto-scroll to newest message.
    *   Typing indicators ("Agent is typing...").
    *   Rendering of "Product Cards" inside the web chat.

**Sample Wireframe:**
```text
+------------------------------------------------------+
| ... Main Site Content Background ...                 |
|                                    +-----------------+
|                                    | UI Agent      X |
|                                    +-----------------+
|                                    | Agent: Hi! How  |
|                                    | can I help you? |
|                                    |                 |
|                                    |           User: |
|                                    | Show me laptops |
|                                    |                 |
|                                    | Agent: Here are |
|                                    | top picks:      |
|                                    | +-------------+ |
|                                    | | [Img] Dell  | |
|                                    | | $899 [Add]  | |
|                                    | +-------------+ |
|                                    | +-------------+ |
|                                    | | [Img] HP    | |
|                                    | | $750 [Add]  | |
|                                    | +-------------+ |
|                                    |                 |
|                                    +-----------------+
|                                    | [Type here..] > |
|                                    +-----------------+
+------------------------------------------------------+
```

### 4.3. Agent-Led Checkout Confirmation
*   **Purpose**: To securely finalize the purchase without leaving the chat, or by guiding the user to a simplified modal.
*   **Layout**:
    *   Appears *within* the chat stream or as a secure overlay.
    *   Section 1: Order Summary (Items & Total).
    *   Section 2: Shipping Info (Pre-filled).
    *   Section 3: Pay Button.
*   **Key Functionalities**:
    *   One-tap confirmation.
    *   Edit link (redirects to manual checkout if details are wrong).

**Sample Wireframe:**
```text
+------------------------------------------------------+
| ... Main Site Content ...                            |
|                                    +-----------------+
|                                    | UI Agent      X |
|                                    +-----------------+
|                                    | ...             |
|                                    |           User: |
|                                    |   Buy it now.   |
|                                    |                 |
|                                    | Agent: Confirm? |
|                                    | +-------------+ |
|                                    | | Total: $899 | |
|                                    | | Ship to:    | |
|                                    | | 123 Main St | |
|                                    | | [CONFIRM]   | |
|                                    | | [ Cancel ]  | |
|                                    | +-------------+ |
|                                    |                 |
|                                    +-----------------+
|                                    | [Type here..] > |
|                                    +-----------------+
+------------------------------------------------------+
```
