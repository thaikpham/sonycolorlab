from playwright.sync_api import sync_playwright

def verify_app(page):
    page.goto("http://localhost:5173")
    page.wait_for_selector("text=Sony Alpha's")
    page.screenshot(path="verification/app_home.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_app(page)
        finally:
            browser.close()
