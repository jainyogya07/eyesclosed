"""
Tests for Spatial Grid and Panchayat Resolution Endpoints.
"""
def test_get_grid_cell_by_id(client):
    response = client.get("/api/v1/grid/CELL_LKO_X02_Y03")
    assert response.status_code == 200
    data = response.json()
    assert data["cell_id"] == "CELL_LKO_X02_Y03"
    assert data["crs"] == "EPSG:32644"
    assert data["resolution_meters"] == 1000
    assert data["easting_max"] - data["easting_min"] == 1000.0
    assert data["northing_max"] - data["northing_min"] == 1000.0
    assert data["center_latitude"] == 26.76
    assert data["center_longitude"] == 80.88
    assert data["panchayat_code"] == "PC_092801"

def test_get_grid_cell_invalid(client):
    response = client.get("/api/v1/grid/CELL_UNKNOWN_99")
    assert response.status_code == 404

def test_query_grid_by_coordinate(client):
    response = client.get("/api/v1/grid?lat=26.76&lon=80.88")
    assert response.status_code == 200
    data = response.json()
    assert data["cell_id"] == "CELL_LKO_X02_Y03"
    assert data["panchayat_name"] == "Amausi"

def test_query_grid_out_of_bounds(client):
    response = client.get("/api/v1/grid?lat=12.97&lon=77.59")
    assert response.status_code == 404
    assert "outside" in response.json()["detail"].lower()

def test_panchayat_api(client):
    # List panchayats
    resp_list = client.get("/api/v1/panchayat")
    assert resp_list.status_code == 200
    assert len(resp_list.json()) == 5

    # Get single panchayat
    resp_one = client.get("/api/v1/panchayat/PC_092801")
    assert resp_one.status_code == 200
    data = resp_one.json()
    assert data["panchayat_name"] == "Amausi"
    assert data["district_name"] == "Lucknow"
    assert data["state_name"] == "Uttar Pradesh"
