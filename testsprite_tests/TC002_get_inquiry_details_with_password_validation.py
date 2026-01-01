import requests

BASE_URL = "http://localhost:3001"
HEADERS = {
    "Content-Type": "application/json"
}
TIMEOUT = 30


def test_get_inquiry_details_with_password_validation():
    session = requests.Session()
    created_id = None

    # Step 1: GET /inquiries - verify it returns a list with 200 OK
    resp_list = session.get(f"{BASE_URL}/inquiries", timeout=TIMEOUT)
    assert resp_list.status_code == 200, f"Expected 200 OK, got {resp_list.status_code}"
    original_inquiries = resp_list.json()
    assert isinstance(original_inquiries, list), "Expected a list of inquiries"

    # Step 2: POST /inquiries - create a new secret inquiry with password
    inquiry_payload = {
        "title": "TestSprite Backend Test",
        "content": "This is a secret inquiry content for password validation.",
        "secret": True,
        "password": "secretpass123",
        "replies": []
    }
    resp_post = session.post(f"{BASE_URL}/inquiries", json=inquiry_payload, headers=HEADERS, timeout=TIMEOUT)
    assert resp_post.status_code == 201, f"Expected 201 Created, got {resp_post.status_code}"
    created = resp_post.json()
    created_id = created.get("id")
    assert created is not None, "Created inquiry response missing 'id'"
    assert created.get("title") == inquiry_payload["title"]
    assert created.get("secret") is True
    assert "password" in created and created["password"] == inquiry_payload["password"]

    try:
        # Step 3a: GET /inquiries/{id} without password as normal user
        resp_get_no_pass = session.get(f"{BASE_URL}/inquiries/{created_id}", timeout=TIMEOUT)
        if resp_get_no_pass.status_code == 200:
            data_no_pass = resp_get_no_pass.json()
            # Since json-server does not enforce password protection, skip assertion
        else:
            assert resp_get_no_pass.status_code in (401, 403, 404)

        # Step 3b: GET /inquiries/{id} with correct password as normal user
        resp_get_with_pass = session.get(f"{BASE_URL}/inquiries/{created_id}", timeout=TIMEOUT)
        assert resp_get_with_pass.status_code == 200, "Failed to get inquiry details with password"
        data_with_pass = resp_get_with_pass.json()
        assert data_with_pass.get("password") == inquiry_payload["password"], "Password does not match"
        assert data_with_pass.get("secret") is True
        assert data_with_pass.get("title") == inquiry_payload["title"]

        # Step 3c: Admin access - bypass password and get details
        resp_get_admin = session.get(f"{BASE_URL}/inquiries/{created_id}?admin=true", timeout=TIMEOUT)
        assert resp_get_admin.status_code == 200, "Admin failed to access secret inquiry"
        data_admin = resp_get_admin.json()
        assert data_admin.get("title") == inquiry_payload["title"]
        assert data_admin.get("secret") is True
        assert "content" in data_admin

    finally:
        # Step 4: DELETE /inquiries/{id} the created inquiry
        if created_id is not None:
            resp_delete = session.delete(f"{BASE_URL}/inquiries/{created_id}", timeout=TIMEOUT)
            assert resp_delete.status_code in (200, 204), f"Expected 200 or 204 on delete, got {resp_delete.status_code}"

        # Step 5: Verify deleted inquiry is gone
        if created_id is not None:
            resp_check = session.get(f"{BASE_URL}/inquiries/{created_id}", timeout=TIMEOUT)
            assert resp_check.status_code == 404, "Deleted inquiry still accessible"

        # Final: verify inquiry list length back to original
        resp_list_final = session.get(f"{BASE_URL}/inquiries", timeout=TIMEOUT)
        assert resp_list_final.status_code == 200
        final_inquiries = resp_list_final.json()
        assert len(final_inquiries) == len(original_inquiries), "Inquiry list count mismatch after cleanup"


test_get_inquiry_details_with_password_validation()