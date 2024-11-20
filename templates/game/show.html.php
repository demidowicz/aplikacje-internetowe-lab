<?php

/** @var \App\Model\game $game */
/** @var \App\Service\Router $router */

$title = "{$game->getTitle()} ({$game->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $game->getTitle() ?></h1>
    <h2>Developer: <?= $game->getDeveloper() ?></h2>
    <p>Release date: <?= $game->getCreatedAt()->format('d-m-Y') ?></p>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('game-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('game-edit', ['id'=> $game->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
