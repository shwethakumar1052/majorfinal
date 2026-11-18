import os
import time
import json
import shutil
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

BASE_DIR = r"c:\Users\Shwetha Kumar\OneDrive\Desktop\New folder (4)"
OUTPUT_DIR = os.path.join(BASE_DIR, "results_figures")
ARTIFACT_DIR = r"C:\Users\Shwetha Kumar\.gemini\antigravity-ide\brain\cb4ea79b-6da4-4f7a-ae3f-53e8e46a150b"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,960")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")

driver = webdriver.Chrome(options=options)

def save_and_copy(filename):
    p1 = os.path.join(OUTPUT_DIR, filename)
    p2 = os.path.join(ARTIFACT_DIR, filename)
    driver.save_screenshot(p1)
    shutil.copy2(p1, p2)
    print(f"[Captured] {filename} saved ({os.path.getsize(p1)} bytes)")

try:
    # -------------------------------------------------------------
    # 1. Figure 6.1: Home Page
    # -------------------------------------------------------------
    driver.get("http://localhost:3000/")
    time.sleep(2.5)
    save_and_copy("Figure_6_1_Home_Page.png")

    # -------------------------------------------------------------
    # 2. Figure 6.2: Citizen Profile Questionnaire Input
    # -------------------------------------------------------------
    driver.get("http://localhost:3000/assess")
    time.sleep(2)
    # Fill in age
    try:
        age_input = driver.find_element(By.TAG_NAME, "input")
        age_input.clear()
        age_input.send_keys("38")
        # Click Male
        buttons = driver.find_elements(By.TAG_NAME, "button")
        for b in buttons:
            if b.text.strip().lower() == "male":
                b.click()
                break
    except Exception as e:
        print("Profile fill note:", e)
    time.sleep(1)
    save_and_copy("Figure_6_2_Profile_Input.png")

    # -------------------------------------------------------------
    # Set profile in localStorage for Ramesh Kumar (Farmer, 38, Karnataka)
    # -------------------------------------------------------------
    sample_profile = {
        "name": "Ramesh Kumar",
        "age": "38",
        "gender": "male",
        "state": "Karnataka",
        "district": "Belagavi",
        "area": "rural",
        "occupation": "farmer",
        "employmentStatus": "self_employed",
        "annualIncome": "120000",
        "education": "secondary",
        "caste": "obc",
        "minority": False,
        "disability": False,
        "bplCard": True,
        "isStudent": False,
        "isWidow": False,
        "goal": ["agricultural equipment subsidy", "crop insurance"]
    }

    driver.execute_script(f"localStorage.setItem('govmatch_profile', JSON.stringify({json.dumps(sample_profile)}));")

    # -------------------------------------------------------------
    # 3. Figure 6.3: Eligibility Filtering Results Page
    # -------------------------------------------------------------
    driver.get("http://localhost:3000/results")
    time.sleep(3.5)
    save_and_copy("Figure_6_3_Eligibility_Results.png")

    # -------------------------------------------------------------
    # 4. Figure 6.4: Scheme Recommendations Page (Scrolled to cards)
    # -------------------------------------------------------------
    # Scroll slightly down to focus on scheme recommendation cards
    driver.execute_script("window.scrollTo(0, 220);")
    time.sleep(1)
    save_and_copy("Figure_6_4_Scheme_Recommendations.png")

    # -------------------------------------------------------------
    # 5. Figure 6.7: Explainable AI — Reasons for Recommendations
    # Expand the XAI Accordion on the first scheme card
    # -------------------------------------------------------------
    try:
        xai_buttons = driver.find_elements(By.XPATH, "//button[contains(., 'Why this scheme matches you')]")
        if xai_buttons:
            driver.execute_script("arguments[0].scrollIntoView(true);", xai_buttons[0])
            time.sleep(0.5)
            xai_buttons[0].click()
            time.sleep(1.5)
    except Exception as e:
        print("XAI accordion click note:", e)
    save_and_copy("Figure_6_7_Recommendation_Explanation.png")

    # -------------------------------------------------------------
    # 6. Figure 6.6: Natural Language Search & Semantic Matching
    # -------------------------------------------------------------
    driver.get("http://localhost:3000/search?q=farmer%20crop%20subsidy")
    time.sleep(3)
    save_and_copy("Figure_6_6_Semantic_Search.png")

    print("All UI screenshots captured successfully!")

finally:
    driver.quit()
