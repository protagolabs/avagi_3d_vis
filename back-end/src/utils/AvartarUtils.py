import requests
import json
import time

import argparse  
import numpy as np
from copy import deepcopy 
import trimesh

# Replace 'your_api_key_here' with your actual API key
api_key = '4eb1MW_aZDLN-cnK8WftZ56WxM0dO3nAQM3clY-LQtis5UJrDTqinO15ekmFhyMiYZtvPFOnpxab3AGRiMgaGw'

# The base URL for the Avaturn.me API
base_url = 'https://api.avaturn.me'

def create_user():
    '''
    return user_id: string if success else None
    '''
    # The specific endpoint for creating a new user
    endpoint = '/api/v1/users/new'
    headers = {
        'Accept': 'application/json',
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }
    response = requests.post(f'{base_url}{endpoint}', headers=headers, data=None)
    # Check if the request was successful
    if response.status_code in [200, 201]:  # 201 is commonly used for successful creation
        # Process the successful response, e.g., extract and print the user ID or other relevant info
        data = response.json()
        user_id = data['id']
        print('User created successfully:')
        print('user_id:', user_id)
        return user_id
    else:
        print('Failed to create user:', response.status_code, response.text)
        return None

# not used yet   
def create_new_session(user_id):
    # The specific endpoint for creating a new session
    endpoint = '/api/v1/sessions/new'
    session_data = {
        "user_id": user_id, # Uncomment or modify according to actual API requirements
        "config": {
            "type": "create_or_edit_existing"
        }# Include other required fields here
    }

    # Headers may need to include an API key for authentication and content type if sending JSON data
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }

    # Make the POST request to create a new session
    response = requests.post(f'{base_url}{endpoint}', headers=headers, data=json.dumps(session_data))

    # Check if the request was successful
    if response.status_code in [200, 201]:  # 201 is commonly used for successful resource creation
        # Process the successful response, e.g., extract and print session details
        session_data = response.json()
        print('Session created successfully:', session_data)
        return session_data # not a fully-programmed pipeline to upload images, need user now scan the QR code at session_data['url']
    else:
        # Handle failed requests
        print('Failed to create session:', response.status_code, response.text)
        return None

def create_new_avatar(user_id):
    endpoint = '/api/v1/avatars/new'
    headers = {
        'Accept': 'application/json',
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }
    data = {
        "user_id": user_id
    }
    response = requests.post(f'{base_url}{endpoint}', headers=headers, data=json.dumps(data))
    # Check if the request was successful
    if response.status_code in [200, 201]:  # 201 is commonly used for successful creation
        # Process the successful response, e.g., extract and print the user ID or other relevant info
        data = response.json()
        avatar_id = data['avatar_id']
        upload_url = data['upload_url']
        print('new avatar init successfully')
        print('avatar_id:', avatar_id)
        print('upload_url:', upload_url)
        return [avatar_id, upload_url]
    else:
        print('Failed to create new avatar:', response.status_code, response.text)
        return None

def upload_image(upload_url, image_frontal, image_side1, image_side2,
                 body_type='male',
                 telephoto='false'):
    '''
    images need to be jpeg format
    '''
    data = {
    'body-type': body_type,
    'telephoto': telephoto,
    }
    files = {
        'image-frontal': ('frontal.jpg', image_frontal, 'image/jpeg'),
        'image-side-1': ('side1.jpg', image_side1, 'image/jpeg'),
        'image-side-2': ('side2.jpg', image_side2, 'image/jpeg')
    }

    response = requests.post(upload_url, data=data, files=files)
    print(response)
    data = response.json()
    print(data)
    print('create 3D avatar upload images, status:', data['status'])
    return data

# TODO: set_customization
    
def list_created_avatars(user_id):
    endpoint = f'/api/v1/users/{user_id}/avatars'
    # print(endpoint)
    # Headers may need to include an API key for authentication and content type if sending JSON data
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Accept': 'application/json',
    }

    # Make the POST request to create a new session
    response = requests.get(f'{base_url}{endpoint}', headers=headers, data=None)

    # Check if the request was successful
    if response.status_code in [200, 201]:  # 201 is commonly used for successful resource creation
        # Process the successful response, e.g., extract and print session details
        avatars_data = response.json()
        print('list created avatars:', avatars_data)
        return avatars_data
    else:
        # Handle failed requests
        print('Failed to create session:', response.status_code, response.text)
        return None

def export_avatar(avatars_data):
    endpoint = f'/api/v1/exports/new'

    # Headers may need to include an API key for authentication and content type if sending JSON data
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    avatar_id = avatars_data[0]['id']

    # Make the POST request to create a new session
    response = requests.post(f'{base_url}{endpoint}?avatar_id={avatar_id}', headers=headers, data=None)

    # Check if the request was successful
    if response.status_code in [200, 201]:  # 201 is commonly used for successful resource creation
        # Process the successful response, e.g., extract and print session details
        export_data = response.json()
        print('export data successfully:', export_data)
        return export_data
    else:
        # Handle failed requests
        print('Failed to export data:', response.status_code, response.text)
        return None
    
def download_from_url(url):
    r = requests.get(url, allow_redirects=True)
    return r.content

def delete_user(user_id):
    endpoint = f'/api/v1/users/{user_id}'
    headers = {
        'Accept': 'application/json',
        'Authorization': f'Bearer {api_key}',
    }
    response = requests.delete(f'{base_url}{endpoint}', headers=headers)
    if response.status_code in [200, 201]:
        print('delete user successfully')
        return 0
    else:
        print('failed to delete user')
        return 1

def delete_user_avatar(user_id, avatar_id):
    endpoint = f'/api/v1/users/{user_id}/avatars/{avatar_id}'
    headers = {
        'Accept': 'application/json',
        'Authorization': f'Bearer {api_key}',
    }
    response = requests.delete(f'{base_url}{endpoint}', headers=headers)
    if response.status_code in [200, 201]:
        print('delete user avatar successfully')
        return 0
    else:
        print('failed to delete user avatar')
        return 1

def extract_head(file_name):
    # we will mostly use T2 model (model with separate eye, tongue, etc.) so delete process for T1
    scene = trimesh.load(file_name)
    # extract head mesh from multiple
    headmesh = scene.geometry['Head_Mesh']
    cc = trimesh.graph.connected_components(headmesh.face_adjacency, min_len=3)
    cc_edgenum_sortindex = np.argsort([-len(c) for c in cc])
    mask = np.zeros(len(headmesh.faces), dtype=bool)
    mask[cc[cc_edgenum_sortindex[0]]] = True
    headmesh.update_faces(mask)
    # separate left/right eyes
    mesh = scene.geometry['Eye_Mesh']
    cc = trimesh.graph.connected_components(mesh.face_adjacency, min_len=3)
    cc_edgenum_sortindex = np.argsort([-len(c) for c in cc])
    mesh_copy = deepcopy(mesh)
    mask = np.zeros(len(mesh.faces), dtype=bool)
    mask[cc[cc_edgenum_sortindex[0]]] = True
    mesh.update_faces(mask)
    mask = np.zeros(len(mesh_copy.faces), dtype=bool)
    mask[cc[cc_edgenum_sortindex[1]]] = True
    mesh_copy.update_faces(mask)
    # right eye should have larger x coordinate
    if mesh.centroid[0] > mesh_copy.centroid[0]:
        scene.add_geometry(mesh, geom_name='Eye_L_Mesh')
        scene.add_geometry(mesh_copy, geom_name='Eye_R_Mesh')
    else:
        scene.add_geometry(mesh_copy, geom_name='Eye_L_Mesh')
        scene.add_geometry(mesh, geom_name='Eye_R_Mesh')
    scene.delete_geometry('Eye_Mesh')
    scene.delete_geometry('Eyelash_Mesh')
    scene.delete_geometry('EyeAO_Mesh')
    scene.delete_geometry('Body_Mesh')
    scene.delete_geometry('avaturn_hair_0')
    scene.delete_geometry('avaturn_shoes_0')
    scene.delete_geometry('avaturn_look_0')
    head_pos = scene.geometry['Head_Mesh'].centroid
    for v in scene.geometry.values():
        v.apply_translation(-head_pos)
    scene.export(file_name)
