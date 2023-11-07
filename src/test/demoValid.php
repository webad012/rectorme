<?php

final class TestClass
{
    private string $privatevar = 'default value';

    public function getprivatevar(): string
    {
        return $this->privatevar;
    }
}