import requests

BASE_URL = "http://localhost:3001"
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30

def test_get_inquiry_list():
    inquiry_data = {
        "title": "TestSprite Backend Test",
        "content": "This is a backend test inquiry.",
        "secret": False,
        "password": "",
        "reply": None
    }
    created_inquiry_id = None

    try:
        # Step 1: GET /inquiries - initial list
        resp = requests.get(f"{BASE_URL}/inquiries", headers=HEADERS, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Expected 200 OK, got {resp.status_code}"
        inquiries_before = resp.json()
        assert isinstance(inquiries_before, list), "Response is not a list"

        # Step 2: POST /inquiries - create a new inquiry
        resp = requests.post(f"{BASE_URL}/inquiries", json=inquiry_data, headers=HEADERS, timeout=TIMEOUT)
        assert resp.status_code == 201, f"Expected 201 Created, got {resp.status_code}"
        created_inquiry = resp.json()
        created_inquiry_id = created_inquiry.get("id")
        assert created_inquiry_id is not None, "Created inquiry has no 'id'"
        assert created_inquiry["title"] == inquiry_data["title"], "Title does not match"
        assert created_inquiry["secret"] == inquiry_data["secret"], "Secret flag does not match"
        assert created_inquiry.get("reply") == inquiry_data["reply"], "Reply status does not match"

        # Step 3: GET /inquiries/{id} - fetch created inquiry by ID
        resp = requests.get(f"{BASE_URL}/inquiries/{created_inquiry_id}", headers=HEADERS, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Expected 200 OK for inquiry fetch, got {resp.status_code}"
        inquiry_by_id = resp.json()
        assert inquiry_by_id["id"] == created_inquiry_id, "Inquiry ID mismatch"
        assert inquiry_by_id["title"] == inquiry_data["title"], "Title mismatch on fetch by ID"
        assert inquiry_by_id["secret"] == inquiry_data["secret"], "Secret flag mismatch on fetch by ID"
        assert inquiry_by_id.get("reply") == inquiry_data["reply"], "Reply mismatch on fetch by ID"

        # Step 4: DELETE /inquiries/{id} - delete created inquiry
        resp = requests.delete(f"{BASE_URL}/inquiries/{created_inquiry_id}", headers=HEADERS, timeout=TIMEOUT)
        assert resp.status_code in [200, 204], f"Expected 200 or 204 on delete, got {resp.status_code}"

        # Step 5: GET /inquiries/{id} - verify deletion
        resp = requests.get(f"{BASE_URL}/inquiries/{created_inquiry_id}", headers=HEADERS, timeout=TIMEOUT)
        assert resp.status_code == 404, f"Expected 404 Not Found after deletion, got {resp.status_code}"

        # Step 6: GET /inquiries - verify deleted inquiry no longer in list
        resp = requests.get(f"{BASE_URL}/inquiries", headers=HEADERS, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Expected 200 OK on final list, got {resp.status_code}"
        inquiries_after = resp.json()
        assert all(i.get("id") != created_inquiry_id for i in inquiries_after), "Deleted inquiry still present in list"

    finally:
        # Cleanup: Delete inquiry if still exists
        if created_inquiry_id is not None:
            requests.delete(f"{BASE_URL}/inquiries/{created_inquiry_id}", headers=HEADERS, timeout=TIMEOUT)

test_get_inquiry_list()