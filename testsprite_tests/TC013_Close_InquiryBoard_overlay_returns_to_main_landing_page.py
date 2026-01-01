import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Open InquiryBoard overlay by clicking the '고객 문의' button.
        frame = context.pages[-1]
        # Click the '고객 문의' button to open the InquiryBoard overlay.
        elem = frame.locator('xpath=html/body/div/div/div/nav/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the close button on the InquiryBoard overlay to close it and return to the main landing page.
        frame = context.pages[-1]
        # Click the close button on the InquiryBoard overlay to close it.
        elem = frame.locator('xpath=html/body/div/div/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=PDF Converter Pro').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=기능 소개').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=이용 방법').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=고객 문의').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=v1.0.0 정식 출시').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=압도적 성능,').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=완벽한 PDF 변환').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=엑셀, 워드, PPT 문서를 원본 그대로.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=보안 걱정 없는 100% 로컬 솔루션.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=무료 다운로드').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=왜 PDF Converter Pro인가?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=더 이상 시간을 낭비하지 마세요.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=강력한 로컬 엔진이 당신의 업무를 순식간에 끝냅니다.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=모든 포맷 지원').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Excel, Word, PPT를 원본 레이아웃 그대로 변환합니다.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=완벽한 보안').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=서버 전송 없이 내 PC에서 안전하게 처리됩니다.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=초고속 엔진').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=대량의 문서도 멈춤 없이 빠르게 처리합니다.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Workflow Process').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=복잡한 과정 없이, 단 4단계로 끝납니다.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=파일 추가').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=문서를 드래그하여 목록에 놓으세요').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=설정 체크').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=병합, 저장 경로 등 옵션을 선택하세요').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=즉시 변환').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=시작 버튼을 누르면 바로 처리됩니다').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=4').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=결과 확인').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=자동으로 열린 폴더에서 파일을 확인하세요').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PDF Converter Pro').nth(1)).to_be_visible(timeout=30000)
        await expect(frame.locator('text=© 2025 PDF Converter Pro. All rights reserved. Designed for privacy and performance. No data leaves your computer.').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    