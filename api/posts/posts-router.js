// implement your posts router here
const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();

// ENDPOINTS

// [GET] fetches all posts 
router.get('/', (req, res) => {
    Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        res.status(500).json({
            message: "Post ID can not be retrieved"
        })
    })
})

// [GET] fetches post by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    Posts.findById(id)
    .then(post => {
        if(!post){
            res.status(404).json({
                message: "Post ID does not exist"
            })
        } else {
            res.status(200).json(post)
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "Info can not be retrieved" 
        })
    })
})

// [POST] creates post and returns newly created post
router.post('/', async (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({
            message: "Title and content required"
        })
    } else {
        try {
            const newId = await Posts.insert({ title, contents })
            const newPost = await Posts.findById(newId.id)
            res.status(201).json(newPost);
    }   catch (err) {
            res.status(500).json({
                message: "There was an error saving to the database"
            })
        }
    }
 })

// [PUT] updates post by id and returns updated post
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({
            message: "Title and content required"
        })
    } else {
        try {
            const count = await Posts.update(id, { title, contents })
            if (count === 1) {
                const updatedPost = await Posts.findById(id)
                res.status(200).json(updatedPost);
            } else {
                res.status(404).json({
                    message: "Post ID does not exist"
                })
            }
        } catch (err) {
            res.status(500).json({
                message: "Post ID can not be modified"
            })
        }
    }
})

// [DELETE] deletes post by id and returns deleted post
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await Posts.findById(id)
        const count = await Posts.remove(id)
        if (count === 1) {
            res.status(200).json(deletedPost)
        } else {
            res.status(404).json({
                message: "Post ID does not exist"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "The post can not be deleted"
        })
    }
})

// [GET] returns array of all comment objects associated with the post by id
router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    Posts.findPostComments(id)
    .then(comments => {
        if(!comments.length) {
            res.status(404).json({
                message: "ID does not exist"
            })
        } else {
            res.status(200).json(comments)
        }
    })
    .catch(err => {
        res.status(500).json({
           message: "Can not be retrieved" 
        })
    })
})


module.exports = router;