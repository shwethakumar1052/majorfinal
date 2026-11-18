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

# Load schemes to get 2 realistic schemes for comparison
SCHEMES_PATH = os.path.join(BASE_DIR, "backend", "schemes_enhanced.json")
with open(SCHEMES_PATH, "r", encoding="utf-8") as f:
    schemes = json.load(f)

# Find 2 popular schemes
kcc = next((s for s in schemes if "kisan" in s.get("name", "").lower()), schemes[0])
svamitva = next((s for s in schemes if "svamitva" in s.get("name", "").lower() or "rural" in s.get("category", "").lower()), schemes[1])

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
    # 1. Chatbot Screenshot
    # -------------------------------------------------------------
    print("Capturing Chatbot...")
    driver.get("http://localhost:3000/")
    time.sleep(3)
    
    # Click chat trigger button
    try:
        chat_btn = driver.find_element(By.XPATH, "//button[@aria-label='Open AI Chat']")
        chat_btn.click()
        time.sleep(1.5)
        
        # Click first quick prompt if available
        quick_prompts = driver.find_elements(By.XPATH, "//button[contains(text(), 'What schemes') or contains(text(), 'How') or contains(text(), 'farmer')]")
        if quick_prompts:
            quick_prompts[0].click()
            time.sleep(3.5)
        else:
            # Type message
            textarea = driver.find_element(By.TAG_NAME, "textarea")
            textarea.send_keys("What schemes are available for farmers?")
            time.sleep(0.5)
            send_btn = driver.find_element(By.XPATH, "//button[contains(@title, 'Voice')]/following-sibling::button")
            send_btn.click()
            time.sleep(4)
    except Exception as e:
        print("Chatbot interaction detail:", e)

    save_and_copy("Figure_6_12_Chatbot_Assistant.png")

    # -------------------------------------------------------------
    # 2. Notification Panel Screenshot
    # -------------------------------------------------------------
    print("Capturing Notifications...")
    driver.get("http://localhost:3000/")
    time.sleep(2)
    try:
        # Click the Notification bell icon
        bell_btn = driver.find_element(By.XPATH, "//button[contains(@aria-label, 'notification') or .//*[local-name()='svg']/*[local-name()='path']]")
        # Find button in navbar with Bell
        nav_buttons = driver.find_elements(By.XPATH, "//header//button")
        for btn in nav_buttons:
            # Find the button containing the bell svg or title
            svgs = btn.find_elements(By.TAG_NAME, "svg")
            if svgs:
                btn.click()
                time.sleep(1)
                # Check if notification dropdown appeared
                if "New Schemes" in driver.page_source or "Notifications" in driver.page_source:
                    break
    except Exception as e:
        print("Notification click note:", e)

    time.sleep(1)
    save_and_copy("Figure_6_13_Notification_Center.png")

    # -------------------------------------------------------------
    # 3. Scheme Comparison Matrix Screenshot
    # -------------------------------------------------------------
    print("Capturing Scheme Comparison...")
    compare_schemes = [
        {
            "slug": kcc.get("slug", "kcc"),
            "name": kcc.get("name", "Kisan Credit Card (KCC)"),
            "ministry": kcc.get("ministry", "Ministry of Agriculture and Farmers Welfare"),
            "category": kcc.get("category", "Agriculture, Rural & Environment"),
            "level": kcc.get("level", "Central"),
            "state": kcc.get("state", "Central"),
            "benefits": kcc.get("benefits", "Institutional credit up to ₹3 Lakh at subsidized 4% interest rate with flexible repayment."),
            "eligibility": kcc.get("eligibility", "All individual/joint farmers, tenant farmers, and self-help groups engaged in agriculture."),
            "application_process": "Apply via nearest commercial bank, regional rural bank, or online PM-KISAN portal.",
            "open_date": "Ongoing",
            "close_date": "Open Year-Round"
        },
        {
            "slug": svamitva.get("slug", "svamitva"),
            "name": svamitva.get("name", "SVAMITVA Yojana"),
            "ministry": svamitva.get("ministry", "Ministry of Panchayati Raj"),
            "category": svamitva.get("category", "Agriculture, Rural & Environment"),
            "level": svamitva.get("level", "Central"),
            "state": svamitva.get("state", "Central"),
            "benefits": svamitva.get("benefits", "Provision of property cards and digital cadastral mapping of rural inhabited lands."),
            "eligibility": svamitva.get("eligibility", "Rural household owners in populated (Abadi) village settlements across India."),
            "application_process": "Survey undertaken through Gram Panchayat drone mapping; property cards issued by state revenue dept.",
            "open_date": "Active Phase",
            "close_date": "Open Year-Round"
        }
    ]

    driver.get("http://localhost:3000/compare")
    time.sleep(1)
    # Inject into localStorage
    driver.execute_script(f"localStorage.setItem('govmatch_compare', JSON.stringify({json.dumps(compare_schemes)}));")
    time.sleep(0.5)
    driver.get("http://localhost:3000/compare")
    time.sleep(2.5)

    save_and_copy("Figure_6_14_Scheme_Comparison.png")

    print("All additional screenshots successfully captured!")

finally:
    driver.quit()
