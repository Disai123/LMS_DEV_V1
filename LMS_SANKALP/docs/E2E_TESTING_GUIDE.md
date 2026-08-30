# SANKALP LMS — Complete Testing Guide

This guide helps you test the full learning experience on SANKALP LMS from start to finish. It is written for **non-technical users** — no IT or programming knowledge is required.

---

## Who should use this guide?

You need **two people** (or one person using two separate browser windows):

| Role | What they do |
|------|----------------|
| **Person A — Course Administrator** | Creates the course, lessons, quizzes, and final exam; checks student results |
| **Person B — Student** | Signs up, joins the course, completes lessons, takes tests, and earns a certificate |

**Estimated time:** 45–60 minutes for the complete flow.

---

## What you need before you start

1. **The website address** — the link to SANKALP LMS (provided by your team).
2. **Administrator login** — email and password for the admin account (provided separately).  
   *Note: Signing up on the website creates a **student** account only. Admin accounts are set up by your team.*
3. **Two browsers** — so admin and student stay logged in at the same time:
   - **Option A:** Use Google Chrome for the administrator and Microsoft Edge (or Firefox) for the student.
   - **Option B:** Use one normal Chrome window for the administrator and one **Private / Incognito** window for the student.
4. **A YouTube video link** — any public tutorial video to use as lesson content during testing.

---

## What you will test (overview)

```
Administrator creates course
        ↓
Administrator adds lessons + quizzes + final exam
        ↓
Administrator publishes the course
        ↓
Student signs up and joins the course
        ↓
Student completes lessons and quizzes
        ↓
Student passes the final exam
        ↓
Student receives a certificate
        ↓
Administrator reviews student performance
```

---

# Part 1 — Course Administrator (Person A)

## Step 1 — Log in as administrator

1. Open the website link you were given.
2. Click **Login** in the top menu.
3. If your team shared a special **Admin login link**, open that link instead. You should see the page title **Admin Portal**.
4. Enter your **Email** and **Password**.
5. Click **Access Admin Portal** (or **Sign In** if you used the standard login page).
6. **You should see:** The Admin Dashboard with a menu on the left showing:
   - **Dashboard**
   - **Courses**
   - **Create Course**
   - **Students**
   - **Analytics**

---

## Step 2 — Create a new course

1. On the left menu, click **Create Course**.
2. Fill in the form:

   | Field | What to enter (example) |
   |-------|-------------------------|
   | **Course Title** * | Introduction to Cloud Computing |
   | **Description** | A short introduction to cloud services and models. |
   | **Category** | Choose one (e.g. Programming or Other) |
   | **Difficulty Level** | Beginner |

3. **Important:** Leave **Publish course immediately** **unchecked** — you will publish the course later, after adding lessons and tests.
4. Click **Create Course**.
5. **You should see:** A confirmation that the course was created, and a section where you can add chapters (lessons).

---

## Step 3 — Add lessons (chapters)

Add **two lessons** so you can test the full flow. Repeat the steps below for each lesson.

### Lesson 1

1. Click **+ Add Chapter**.
2. Fill in:

   | Field | What to enter |
   |-------|----------------|
   | **Chapter Title** * | Lesson 1 — Getting Started |
   | **Description** | Optional — e.g. "Introduction to the topic" |
   | **Content Type** * | Video |
   | **Video URL** * | Paste any public YouTube link |
   | **Duration (minutes)** * | 5 |
   | **Publish this chapter immediately** | Leave checked ✓ |

3. Click **Create Chapter**.
4. **You should see:** "Lesson 1 — Getting Started" listed as the first chapter.

### Lesson 2

1. Click **+ Add Chapter** again.
2. Use the same steps with:
   - **Chapter Title:** Lesson 2 — Core Concepts
   - **Video URL:** Another YouTube link (can be the same or different)
   - **Duration (minutes):** 5
3. Click **Create Chapter**.
4. **You should see:** Both lessons listed in order.

**Tip:** Using **5 minutes** per lesson keeps testing quick. Students must spend most of that time (or watch the video) before they can move to the next step.

---

## Step 4 — Open the full course editor (for tests)

1. Click **Open Full Edit** on the create-course page  
   **OR** go to **Courses** on the left menu → find your course → click **Edit**.
2. Scroll to the bottom of the page until you see the **Tests** section.

---

## Step 5 — Add a quiz after Lesson 1

1. In the **Tests** section, click **+ Add Test** (or **Create First Test** if none exist yet).
2. Fill in:

   | Field | What to enter |
   |-------|----------------|
   | **Test Title** * | Lesson 1 Quiz |
   | **Test Type** * | Chapter Quiz |
   | **Link to Chapter** * | Select "Lesson 1 — Getting Started" (or your Lesson 1 title) |
   | **Passing Score (%)** * | 70 |
   | **Max Attempts** | 3 |

3. Click **Create Test**.
4. **You should see:** A test card with a **Chapter Quiz** label.

### Add questions to Lesson 1 Quiz

1. On the Lesson 1 Quiz card, click **+ Add Question**.
2. Fill in:
   - **Question Text:** e.g. "What is cloud computing?"
   - **Question Type:** Multiple Choice
   - **Points:** 1 (default is fine)
   - Add **2 to 4 answer options** — type each option and tick the box for the **correct** answer
3. Click **+ Add This Question**.
4. Add **at least one more question** the same way.
5. When finished, click **Done Adding Questions**.

---

## Step 6 — Add a quiz after Lesson 2

Repeat Step 5 for Lesson 2:

- **Test Title:** Lesson 2 Quiz  
- **Test Type:** Chapter Quiz  
- **Link to Chapter:** Lesson 2  
- **Passing Score:** 70  
- **Max Attempts:** 3  
- Add **2 or more questions**, then click **Done Adding Questions**

---

## Step 7 — Add the final exam

1. Click **+ Add Test** again.
2. Fill in:

   | Field | What to enter |
   |-------|----------------|
   | **Test Title** * | Final Exam |
   | **Test Type** * | Final Exam |
   | **Passing Score (%)** * | 65 |

   *(Final exam does not need to be linked to a specific lesson.)*

3. Click **Create Test**.
4. **You should see:** A test card with a **Final Exam** label.
5. Click **+ Add Question** and add **at least 2–3 questions** (same process as the quizzes).
6. Click **Done Adding Questions**.

**You should now have:** 2 Chapter Quizzes + 1 Final Exam, each with questions.

---

## Step 8 — Publish the course

1. On the left menu, click **Courses**.
2. Find your course — the status should show **Draft**.
3. Click the **Publish** button on that course card.
4. **You should see:** The status change to **Live**.

---

## Step 9 — Confirm the course is visible

1. Click **Home** or **Courses** in the **top** menu (main website navigation).
2. **You should see:** Your course listed on the Courses page — ready for students to join.

---

**Administrator setup is complete.**  
Tell Person B (the student) they can now sign up and enroll in the course.

---

# Part 2 — Student (Person B)

**Important:** Use a **different browser** or **Private / Incognito** window so you are **not** logged in as the administrator.

---

## Step 1 — Create a student account

1. Open the same website link.
2. Click **Login**, then click **Register here** (link at the bottom of the login page).
3. Fill in:

   | Field | What to enter |
   |-------|----------------|
   | **Full Name** * | Test Student (or your name) |
   | **Email Address** * | A valid email address |
   | **Password** * | At least 6 characters |
   | **Confirm Password** * | Same password again |

4. Click **Create Account**.
5. **You should see:** A welcome message and your **student dashboard** with your name at the top.

---

## Step 2 — Find and join the course

1. Click **Courses** in the top menu  
   **OR** click **Browse Courses** on your dashboard.
2. Click the course the administrator created (e.g. "Introduction to Cloud Computing").
3. Click **Enroll Now**.
4. **You should see:** The course opens with **Lesson 1** on the left side and the video in the main area.

---

## Step 3 — Complete Lesson 1

1. Watch the video on the page.  
   **Tip:** After the video loads, the **Next** button often becomes available without waiting the full 5 minutes.
2. If **Next** is still greyed out, stay on the lesson page for about **5 minutes** (the duration set by the administrator).
3. When **Next** is active (clickable), click **Next**.
4. **You should see:** A message that the lesson content is complete, and the **Lesson 1 Quiz** step appears (or a **Go to Quiz** option).

---

## Step 4 — Take the Lesson 1 Quiz

1. Click **Take Test** or **Go to Quiz**.
2. Click **Start Test** on the ready screen.
3. Read each question and select your answers.
4. On the last question, click **Submit Test** (you must answer all questions first).

### After submitting

| Result | What you see | What to do |
|--------|--------------|------------|
| **Passed** | **Congratulations!** with your score | Click **Continue Learning** — you move to the next lesson |
| **Failed** (attempts left) | **Keep Trying!** with your score | Click **Retry Quiz** — you can try again (up to 3 times total) |
| **Failed** (no attempts left) | **Attempts Complete** | Click **Continue to Next Chapter** — you can still proceed |

---

## Step 5 — Complete Lesson 2

Repeat Steps 3 and 4 for **Lesson 2**:

1. Watch the video → click **Next** when enabled.
2. Take **Lesson 2 Quiz** → submit answers.

---

## Step 6 — Complete the course and take the final exam

1. After finishing Lesson 2 and its quiz, look for **Complete Course** and click it.
2. A **Rate this Course** window may appear:
   - Click **Skip Review** to continue quickly, **OR**
   - Select a star rating and click **Submit Review & Take Test**.
3. Scroll down to the **Course Tests** section.
4. **You should see:** The **Final Exam** is **unlocked** (no lock icon).
5. Click **Take Test** on the Final Exam.
6. Click **Start Test** → answer all questions → **Submit Test**.
7. **You should see:** **Congratulations!** — a message that you passed and earned a certificate.

---

## Step 7 — View your certificate

1. Click **Certificates** in the top menu.
2. **You should see:** Your course listed with a certificate.
3. Click **View** to open it, or use the download option if available.

---

## Step 8 — Check your profile (optional)

1. Click your **name** or profile icon (top right) → **Profile**.
2. Open the **Statistics** tab.
3. **You should see:** Updated numbers for enrolled courses, progress, and completed courses.

---

**Student testing is complete.**

---

# Part 3 — Administrator checks results (Person A again)

Switch back to the **administrator's browser**.

---

## Step 1 — Open the student list

1. On the left menu, click **Students**.
2. Use the search box to find the student by **name** or **email**.
3. Click **View** next to their name.

---

## Step 2 — Review the Overview tab

The **Overview** tab opens by default.

**You should see:**

| Section | What to check |
|---------|----------------|
| Summary cards | Enrolled count, Content Done, Certified, Certificates |
| **Course Progress** | Progress bar for the course (should be 100% if fully complete) |
| **Assessments** | Each test listed with score and **Passed** or **Failed** |
| **Certificates** | Certificate number for the completed course |

---

## Step 3 — Review the Performance tab

1. Click the **Performance** tab at the top of the student page.
2. **You should see** summary boxes: Average Progress, Time Spent, Certified courses, Tests Passed, Average Total Marks.
3. Click on the **course card** to expand it.
4. **You should see:**
   - **Total Marks** for the course
   - **Quiz Average** and **Final Exam** scores
   - A **Chapter Breakdown** table with each lesson's quiz score, number of attempts, and pass/fail status

---

## Step 4 — Review Analytics (all students in one course)

1. On the left menu, click **Analytics**.
2. Scroll down to **Course Enrollments & Certificates**.
3. Open the dropdown **Select a course** and choose your test course.
4. **You should see** a table with columns including:
   - Student name and email
   - Progress
   - **Quiz Avg**
   - **Final Exam**
   - **Total Marks**
   - **Time Spent**
   - Certificate status
5. Click the **student's name** in the table to open their full Performance report.

---

# Testing checklist (sign-off)

Print this page and tick each item when done.

### Administrator — course setup

- [ ] Logged in to Admin Dashboard
- [ ] Created a course with a title and description
- [ ] Added Lesson 1 (video + 5 min duration)
- [ ] Added Lesson 2 (video + 5 min duration)
- [ ] Created Lesson 1 Quiz with at least 2 questions
- [ ] Created Lesson 2 Quiz with at least 2 questions
- [ ] Created Final Exam with at least 2 questions
- [ ] Published the course (status shows **Live**)
- [ ] Course appears on the public **Courses** page

### Student — learning flow

- [ ] Created a new student account
- [ ] Enrolled in the test course
- [ ] Completed Lesson 1 (Next button worked)
- [ ] Passed or completed Lesson 1 Quiz
- [ ] Completed Lesson 2
- [ ] Passed or completed Lesson 2 Quiz
- [ ] Clicked **Complete Course**
- [ ] Final Exam was unlocked
- [ ] Passed the Final Exam
- [ ] Certificate visible on **Certificates** page

### Administrator — verification

- [ ] Student appears in **Students** list
- [ ] **Overview** tab shows correct progress and assessments
- [ ] **Performance** tab shows quiz scores and total marks
- [ ] **Analytics** course table shows the student with marks

---

**Overall test result:** ☐ Pass  ☐ Fail  

**Tester name:** _______________________  

**Date:** _______________________  

**Notes / issues found:**  

_________________________________________________________________  

_________________________________________________________________  

---

# Common problems and what to do

| What you see | What to try |
|--------------|-------------|
| **Unable to Load Dashboard** | Refresh the page (press F5). If it continues, contact your support team. |
| **Next** button stays grey and cannot be clicked | Watch the video, or wait on the lesson page for about 5 minutes (for a 5-minute lesson). |
| **Final Exam** shows a lock icon | Finish **all lessons** and **all lesson quizzes** first. |
| Course not visible on **Courses** page | The administrator must click **Publish** on the **Courses** page in the admin area. |
| Quiz shows **Failed** but the score looks high | Refresh the page. If it is still wrong, write down the score and report it to support. |
| Cannot log in as administrator | Use the admin email and password provided by your team. The **Register** page only creates student accounts. |
| Admin and student keep switching accounts | Use two different browsers, or one normal window and one Private/Incognito window. |

---

# Appendix — Sample text you can copy

Use these examples when filling in forms during testing.

**Course title:**  
`Introduction to Cloud Computing`

**Lesson titles:**  
- `Lesson 1 — Getting Started`  
- `Lesson 2 — Core Concepts`

**Sample quiz question:**  
- **Question:** Which of the following is a cloud service model?  
- **Options:** IaaS ✓ (correct), HTML, Bluetooth, Local printer  

**Sample final exam question:**  
- **Question:** Cloud computing allows you to access services over the internet. True or False?  
- **Answer:** True ✓  

---

*SANKALP LMS — Testing Guide for clients. For technical setup or server access, contact your implementation team.*
