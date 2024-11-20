<?php
    /** @var $game ?\App\Model\game */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="game[title]" value="<?= $game ? $game->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="developer">Developer</label>
    <input type="text" id="developer" name="game[developer]" value="<?= $game ? $game->getDeveloper() : '' ?>">
</div>

<div class="form-group">
    <label for="created_at">Release date</label>
    <input type="date" id="created_at" name="game[created_at]" value="<?= $game && $game->getCreatedAt() ? $game->getCreatedAt()->format('Y-m-d') : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
