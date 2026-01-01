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
        # -> Resize viewport to 700px width to simulate tablet and observe hero text wrapping.
        await page.goto('http://localhost:5173/', timeout=10000)
        await asyncio.sleep(3)
        

        await page.mouse.wheel(0, await page.evaluate('() => window.innerHeight'))
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=The Ultimate').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Batch PDF Converter').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=단조로운 업무는 기계에게, 창조적인 일은 당신에게.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=압도적인 퍼포먼스의 다크 모드 PDF 변환기를 경험하세요.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=무료 다운로드 시작').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Powerful Features').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=모든 문서 지원').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Excel, Word, PPT 등 다양한 포맷을 원본 그대로 완벽하게 변환합니다.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=로컬 엔진 처리').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=서버 전송 없이 내 PC에서 즉시 처리되어 보안 걱정이 없습니다.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=초고속 배치').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=독자적인 멀티스레드 엔진으로 수백 장의 문서를 순식간에 처리합니다.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Workflow Process').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=복잡한 과정 없이, 단 4단계로 끝나는 직관적인 사용법').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=파일 업로드').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=드래그 앤 드롭으로 여러 파일을 한 번에 추가').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=옵션 설정').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=병합, 저장 경로 등 필요한 옵션을 체크').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=AI 변환').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=시작 버튼 클릭 시 고속 엔진이 자동 변환').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=4').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=완료 및 확인').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=폴더가 자동으로 열리며 결과물 즉시 확인').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PDF AUTO').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=© 2025 PDF AUTO. All rights reserved. Designed for privacy and performance. No data leaves your computer.').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    