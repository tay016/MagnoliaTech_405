import React from 'react';

export class HierarchyLevel {
    constructor(data) {
        this.data = data;
        this.parent = null;
        this.children = []
    }
}

export class HierarchyTree {
    constructor(data) {
        var node = new HierarchyLevel(data);
        this.root = node;
    }

    preorder(node) {
        var currentNode = !node ? this.root : node;
        var layer = 0;
        if(currentNode) {
            this.write(currentNode, layer);
            for(var i = 0; i < currentNode.children.length; i++) {
                currentNode.children.length &&this.preorder(currentNode.children[i]);
            }
            layer++;
        }
    }

    write(node, layer) {
        var tabs = 0;
        for (var i = 0; i < layer; i++) {
            tabs += "\t"
        }
        return (
            <h2>{tabs + node.data}</h2>
        )
    }

}