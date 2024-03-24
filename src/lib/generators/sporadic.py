from random import randint, uniform, choices, choice
from pprint import pprint
import json, string

def generate_data(node_count, row_max, func_count, var_count, position = 700, edge_create_weights = [0.5,0.5], weights = [0.9,0.1]):
    node_type = ['reg', 'out']

    def id_generator(size=6, chars=string.ascii_lowercase + string.digits):
        return ''.join(choice(chars) for _ in range(size))

    def weighted_random_int(min_val, max_val, weights):
        integer_choices = list(range(min_val, max_val + 1))
        chosen_integer = choices(integer_choices, weights)[0]
        return chosen_integer

    def calculate_position(node_number):
        return {
            'x': (node_number % row_max) * position,
            'y': (node_number // row_max) * position,
        }

    def random_int_or_float(min_val, max_val):
        choice = randint(0,2)
        if choice == 0:
            return str(randint(min_val, max_val))
        elif choice == 1:
            return str(round(uniform(min_val, max_val), 2))
        else:
            numerator = randint(1,10)
            denominator = randint(1,10)
            if numerator == denominator:
                return '1'
            if denominator == 1:
                return str(numerator)
            return '%s/%s' % (randint(1,10), randint(1,10))


    nodes = []
    for i in range(node_count):
        set_var_count = randint(1,var_count)
        set_func_count = randint(1,func_count)
        pos = calculate_position(i)
        ntype = choices(node_type,weights,k=1)[0]
        node = {
            'id':id_generator(8),
            'data': {
                'var_': [
                    [
                        'x_{(%s,%s)}'%(i,j),
                        random_int_or_float(-1,5)
                    ]
                    for j in range(set_var_count) if ntype == 'reg'
                ],
                'prf': [
                    [
                        'f_{(%s,%s)}'%(j,i),
                        weighted_random_int(0,9,[0.1]*10),
                        [
                            [
                                'x_{(%s,%s)}'%(k,i),
                                random_int_or_float(-1,5)
                            ]
                            for k in range(set_var_count)
                        ]
                    ]
                    for j in range(set_func_count) if ntype == 'reg'
                ],
                'train': [],
                'label': 'n_{{{i}}}'.format(i=i),
                'ntype': ntype,
                'x': pos['x'],
                'y': pos['y'],
            }
        }

        if ntype == 'out':
            node['data']['train'] = []

        nodes.append(node)

    edges = []
    for i in range(len(nodes)):
        for j in range(len(nodes)):
            if i!=j:
                create = weighted_random_int(0,1,edge_create_weights)
                if create and nodes[i]['data']['ntype'] == 'reg':
                    edges.append({
                        'id':'syn_{(%s,%s)}'%(i,j),
                        'source':'n_{{{i}}}'.format(i=i),
                        'target':'n_{{{j}}}'.format(j=j),
                    })

    return { 'nodes':nodes, 'edges':edges }


var_count = 3
func_count = 2
a = 2; b = 8
for i in range(a, b):
    print([i/b,1-i/b], [1,0.3-0.3*((i-2)/(i-1))])
    data = generate_data(i**2, i, func_count, var_count, edge_create_weights = [i/b,1-i/b], weights = [1,0.3-0.3*((i-2)/(i-1))])
    with open('data%s.json'%i**2, 'w') as f:
        json.dump(data, f)