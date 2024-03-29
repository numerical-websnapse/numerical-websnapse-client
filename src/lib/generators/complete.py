from random import randint, uniform, choices, choice
from pprint import pprint
import json, string

import numpy as np

def circle_points(r, n):
    circles = []
    for r, n in zip(r, n):
        t = np.linspace(0, 2*np.pi, n, endpoint=False)
        x = r * np.cos(t)
        y = r * np.sin(t)
        circles.append(np.c_[x, y])
    return circles

def id_generator(size=6, chars=string.ascii_lowercase + string.digits):
    return ''.join(choice(chars) for _ in range(size))

def generate_radius(n):
    return [count*100 for count in n]

def generate_data(positions, type = 'one', loop = False, data_template = None):
    nodes = []
    for i, pos in enumerate(positions):
        nodes.append({
            'id': id_generator(8),
            'data': {
                'label' : '\\sigma_{%s}'%(i),
                'ntype' : 'reg',
                'var_'  : [['x_{(1,2)}', '1']],
                'prf'   : [['f_{(1,2)}', '', [['x_{(1,2)}', '1']]]],
                'train' : [],
                'x'     : pos[0],
                'y'     : pos[1],
            } if data_template is None else {
                'label' : '\\sigma_{%s}'%(i),
                'ntype' : 'reg',
                'var_'  : data_template['var_'],
                'prf'   : data_template['prf'],
                'train' : [],
                'x'     : pos[0],
                'y'     : pos[1],
            }
        })

    edges = []
    for i, node1 in enumerate(nodes):
        for j, node2 in enumerate(nodes):
            if i == j:
                continue
            edges.append({
                'id': id_generator(12),
                'source': node1['id'],
                'target': node2['id'],
                'data'  : {},
            })
                

    return {
        'nodes': nodes,
        'edges': edges,
    }


n = [16, 32, 64, 128]
r = generate_radius(n)
circles = circle_points(r, n)

for i, circle in enumerate(circles):
    data = generate_data(circle.tolist())
    with open(f'../tests/complete/complete-{n[i]}.json', 'w') as f:
        json.dump(data, f)





