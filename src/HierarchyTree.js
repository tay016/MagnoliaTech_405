import React from 'react';

// 404 Group can use this tree class to properly format the different hierarchy levels
export class HierarchyLevel {
    constructor(data) {

        this.data = data;
        this.parent = null;
        this.children = []
    }
    
    setParentLevel(level) {
        this.parent = level;
    }

    getParentLevel() {
        return this.parent;
    }

    addChild(level) {
        level.setParentLevel(this);
        this.children[this.children.length] = level;
    }

    getChildren() {
        return this.children;
    }

    removeChildren() {
        this.children = []
    }
}

export class HierarchyTree {
    constructor(data) {
        var node = new HierarchyLevel(data);
        this.root = node;
    }

    preorder(level) {
        var currentLevel = !level ? this.root : level;
        var layer = 0;
        if(currentLevel) {
            this.write(currentLevel, layer);
            for(var i = 0; i < currentLevel.children.length; i++) {
                currentLevel.children.length && this.preorder(currentLevel.children[i]);
            }
            layer++;
        }
    }

    searchNode(data, level) {
        var currentLevel = !level ? this.root : level;
        if(currentLevel) {
            for(var i = 0; i < currentLevel.children.length; i++) {
                if(currentLevel.children[i].data == data) {
                    return i;
                }
                currentLevel.children.length && this.preorder(currentLevel.children[i]);
            }
        }
    }

    write(level, layer) {
        var tabs = 0;
        for (var i = 0; i < layer; i++) {
            tabs += "\t"
        }
        return (
            <h2>{tabs + level.data}</h2>
        )
    }

}